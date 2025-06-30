use crate::{
    constants::{SEED_PREFIX, TREASURY_PUBKEY, VERSION, WSOL_PUBKEY},
    errors::ErrorCode,
    events::PoolAccountCreated,
    helpers::validate_authority,
    state::{CreatePoolAccountParams, PoolAccount, PoolAccountInitArgs},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

#[derive(Accounts)]
#[instruction()]
pub struct CreatePoolAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account()]
    pub mint: Account<'info, Mint>,

    #[account()]
    pub vault_wsol: Account<'info, TokenAccount>,

    #[account()]
    pub vault_mint: Account<'info, TokenAccount>,

    #[account()]
    pub treasury_mint: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = signer,
        space = PoolAccount::DISCRIMINATOR.len() + PoolAccount::INIT_SPACE,
        seeds = [SEED_PREFIX,  &VERSION.to_le_bytes(), mint.key().as_ref()],
        bump
    )]
    pub pool_account: Account<'info, PoolAccount>,

    pub system_program: Program<'info, System>,
}

impl CreatePoolAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        let mint = &ctx.accounts.mint.key();
        validate_authority(&ctx.accounts.signer)?;
        if &ctx.accounts.vault_wsol.mint != &WSOL_PUBKEY {
            return Err(error!(ErrorCode::InvalidWSOLAccount));
        }
        if &ctx.accounts.vault_mint.mint != mint {
            return Err(error!(ErrorCode::InvalidMintAccount));
        }
        if &ctx.accounts.treasury_mint.mint != mint {
            return Err(error!(ErrorCode::InvalidTreasuryAccount));
        }
        if &ctx.accounts.treasury_mint.owner != &TREASURY_PUBKEY {
            return Err(error!(ErrorCode::InvalidTreasuryOwner));
        }
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn create_pool_account(
        ctx: Context<CreatePoolAccount>,
        params: CreatePoolAccountParams,
    ) -> Result<()> {
        // Save
        let pool_account = &mut ctx.accounts.pool_account;
        **pool_account = PoolAccount::new(PoolAccountInitArgs {
            bump: ctx.bumps.pool_account,
            mint: ctx.accounts.mint.key(),
            vault_wsol: ctx.accounts.vault_wsol.key(),
            vault_mint: ctx.accounts.vault_mint.key(),
            treasury: ctx.accounts.treasury_mint.key(),
            lamports_per_pixel: params.lamports_per_pixel,
            burn: params.burn,
        })?;
        emit!(PoolAccountCreated {
            bump: pool_account.bump,
            mint: pool_account.mint,
            vault_wsol: pool_account.vault_wsol,
            vault_mint: pool_account.vault_mint,
            treasury: pool_account.treasury,
            lamports_per_pixel: pool_account.lamports_per_pixel,
            burn: pool_account.burn,
        });
        Ok(())
    }
}
