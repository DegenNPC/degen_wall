use crate::{
    constants::{SEED_PREFIX, VERSION, WSOL_PUBKEY},
    errors::ErrorCode,
    events::PixelsAccountCreated,
    helpers::{calculate_sol_fee, validate_pixels_params, validate_treasury_account},
    state::{
        CreatePixelsAccountParams, MetadataAccount, PixelsAccount, PixelsAccountInitArgs,
        PoolAccount, SolTreasuryAccount,
    },
};
use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction::transfer},
};
use anchor_spl::token::{
    burn as burn_spl, transfer as transfer_spl, Burn, Mint, Token, TokenAccount, Transfer,
};
use std::convert::TryInto;

#[derive(Accounts)]
pub struct CreatePixelsAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: Just a way of assigning unique id
    #[account()]
    pub id: AccountInfo<'info>,

    /// CHECK: Checked against metadata_account.id
    #[account()]
    pub metadata: AccountInfo<'info>,

    #[account(
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), signer.key().as_ref(), metadata.key().as_ref()],
        bump
    )]
    pub metadata_account: Box<Account<'info, MetadataAccount>>,

    #[account(
        init,
        payer = signer,
        space = PixelsAccount::DISCRIMINATOR.len() + PixelsAccount::INIT_SPACE,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), signer.key().as_ref(), metadata.key().as_ref(), id.key().as_ref()],
        bump
    )]
    pub pixels_account: Box<Account<'info, PixelsAccount>>,

    #[account(
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes()],
        bump = sol_treasury_account.bump
    )]
    pub sol_treasury_account: Option<Box<Account<'info, SolTreasuryAccount>>>,

    #[account(mut)]
    /// CHECK: This is validated against the address stored in SolTreasury
    pub treasury: Option<AccountInfo<'info>>,

    #[account()]
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), mint.key().as_ref()],
        bump = pool_account.bump
    )]
    pub pool_account: Option<Box<Account<'info, PoolAccount>>>,

    #[account(mut)]
    pub treasury_mint: Option<Box<Account<'info, TokenAccount>>>,

    #[account(mut)]
    pub payer_token_account: Option<Box<Account<'info, TokenAccount>>>,

    #[account()]
    pub vault_wsol: Option<Box<Account<'info, TokenAccount>>>,

    #[account()]
    pub vault_mint: Option<Box<Account<'info, TokenAccount>>>,

    pub token_program: Option<Program<'info, Token>>,

    pub system_program: Program<'info, System>,
}

impl CreatePixelsAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>, params: &CreatePixelsAccountParams) -> Result<()> {
        let accounts = &ctx.accounts;

        let token_mode = accounts.mint.as_ref().key() != WSOL_PUBKEY;

        if token_mode {
            // Mint
            let pool_account = accounts
                .pool_account
                .as_ref()
                .ok_or(ErrorCode::MissingPoolAccount)?;
            let treasury_mint = accounts
                .treasury_mint
                .as_ref()
                .ok_or(ErrorCode::MissingTreasuryMintAccount)?;
            let payer_token_account = accounts
                .payer_token_account
                .as_ref()
                .ok_or(ErrorCode::MissingPayerTokenAccount)?;
            let vault_wsol = accounts
                .vault_wsol
                .as_ref()
                .ok_or(ErrorCode::MissingVaultWsolAccount)?;
            let vault_mint = accounts
                .vault_mint
                .as_ref()
                .ok_or(ErrorCode::MissingVaultMintAccount)?;

            validate_treasury_account(&treasury_mint.key(), &pool_account.treasury)?;
            if accounts.mint.key() != pool_account.mint {
                return Err(error!(ErrorCode::InvalidMintAccount));
            }
            if vault_wsol.key() != pool_account.vault_wsol {
                return Err(error!(ErrorCode::InvalidWSOLAccount));
            }
            if vault_mint.key() != pool_account.vault_mint {
                return Err(error!(ErrorCode::InvalidMintAccount));
            }
            if accounts.mint.key() != payer_token_account.mint {
                return Err(error!(ErrorCode::InvalidPayerTokenAccount));
            }
        } else {
            // SOL
            let sol_treasury_account = accounts
                .sol_treasury_account
                .as_ref()
                .ok_or(ErrorCode::MissingSolTreasuryAccount)?;
            let treasury = accounts
                .treasury
                .as_ref()
                .ok_or(ErrorCode::MissingTreasuryAccount)?;

            validate_treasury_account(&treasury.key(), &sol_treasury_account.treasury)?;
        }
        validate_pixels_params(params)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn create_pixels_account(
        ctx: Context<CreatePixelsAccount>,
        params: CreatePixelsAccountParams,
    ) -> Result<()> {
        let id = &ctx.accounts.id;
        let metadata = &ctx.accounts.metadata;
        let mint = &ctx.accounts.mint;
        let pool_account = &ctx.accounts.pool_account;
        let sol_treasury_account = &ctx.accounts.sol_treasury_account;
        let token_program = &ctx.accounts.token_program;
        let signer = &mut ctx.accounts.signer;
        let token_mode = mint.key() != WSOL_PUBKEY;

        let (lamports_per_pixel, burn) = if token_mode {
            let pool_account = pool_account.as_ref().unwrap();
            (pool_account.lamports_per_pixel, pool_account.burn)
        } else {
            (sol_treasury_account.as_ref().unwrap().lamports_per_pixel, false)
        };
        let required_fee_sol = calculate_sol_fee(&params.data, lamports_per_pixel);

        // Mint
        if token_mode {
            // Check balances
            let payer_token_account = &ctx.accounts.payer_token_account;
            let payer_token_account = payer_token_account.as_ref().unwrap();
            let vault_wsol = &ctx.accounts.vault_wsol;
            let vault_mint = &ctx.accounts.vault_mint;
            let vault_wsol_amount_u128 = vault_wsol.as_ref().unwrap().amount as u128;
            let vault_mint_amount_u128 = vault_mint.as_ref().unwrap().amount as u128;
            let required_fee_sol_u128 = required_fee_sol as u128;
            let denominator = vault_wsol_amount_u128
                .checked_sub(required_fee_sol_u128)
                .ok_or(ErrorCode::InsufficientVaultReserves)?;

            let numerator = vault_wsol_amount_u128
                .checked_mul(vault_mint_amount_u128)
                .ok_or(ErrorCode::MathOverflow)?;

            let fee_u128 = numerator
                .checked_div(denominator)
                .ok_or(ErrorCode::MathOverflow2)?;

            let required_fee_mint = fee_u128
                .checked_sub(vault_mint_amount_u128)
                .ok_or(ErrorCode::MathOverflow3)?
                .try_into()
                .map_err(|_| ErrorCode::MathOverflow4)?;
            if payer_token_account.amount < required_fee_mint {
                return Err(error!(ErrorCode::StopBeingPoor));
            }
            // Init
            let treasury_mint = &mut ctx.accounts.treasury_mint;
            let treasury_mint = treasury_mint.as_mut().unwrap();
            let token_program = token_program.as_ref().unwrap();
            let from = payer_token_account.to_account_info();
            let authority = signer.to_account_info();
            let to = treasury_mint.to_account_info();
            let mint = mint.to_account_info();
            let token_program_info = token_program.to_account_info();
            if burn {
                // Burn!
                let cpi_accounts = Burn {
                    from,
                    authority,
                    mint,
                };
                let cpi_ctx = CpiContext::new(token_program_info, cpi_accounts);
                burn_spl(cpi_ctx, required_fee_mint)?;
            }
            // SOL
            else {
                // Pay!
                let cpi_accounts = Transfer {
                    from,
                    authority,
                    to,
                };
                let cpi_ctx = CpiContext::new(token_program_info, cpi_accounts);
                transfer_spl(cpi_ctx, required_fee_mint)?;
            }
        } else {
            // Transfer
            let treasury = &mut ctx.accounts.treasury;
            let treasury = treasury.as_mut().unwrap();
            let ix = transfer(&signer.key(), &treasury.key(), required_fee_sol);
            invoke(&ix, &[signer.to_account_info(), treasury.to_account_info()])
                .map_err(|_| error!(ErrorCode::NotEnoughMoneyForGas))?;
        }
        // Save
        let pixels_account = &mut *ctx.accounts.pixels_account;
        **pixels_account = PixelsAccount::new(PixelsAccountInitArgs {
            bump: ctx.bumps.pixels_account,
            lamports_per_pixel,
            burn,
            id: id.key(),
            metadata: metadata.key(),
            mint: mint.key(),
            params: &params,
        })?;
        // Emit event
        emit!(PixelsAccountCreated {
            bump: pixels_account.bump,
            version: pixels_account.version,
            nonce: pixels_account.nonce,
            lamports_per_pixel: pixels_account.lamports_per_pixel,
            burn: pixels_account.burn,
            epoch: pixels_account.epoch,
            slot: pixels_account.slot,
            id: pixels_account.id,
            metadata: pixels_account.metadata,
            mint: pixels_account.mint,
            data: pixels_account.data.clone(),
            tweet: params.tweet,
        });
        Ok(())
    }
}
