use crate::{
    constants::{SEED_PREFIX, VERSION},
    events::SolTreasuryAccountCreated,
    helpers::validate_authority,
    state::{CreateSolTreasuryAccountParams, SolTreasuryAccount, SolTreasuryAccountInitArgs},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreateSolTreasuryAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = SolTreasuryAccount::DISCRIMINATOR.len() + SolTreasuryAccount::INIT_SPACE,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes()],
        bump
    )]
    pub sol_treasury_account: Account<'info, SolTreasuryAccount>,

    pub system_program: Program<'info, System>,
}

impl CreateSolTreasuryAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        validate_authority(&ctx.accounts.signer)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn create_sol_treasury_account(
        ctx: Context<CreateSolTreasuryAccount>,
        params: CreateSolTreasuryAccountParams,
    ) -> Result<()> {
        // Save
        let sol_treasury_account = &mut ctx.accounts.sol_treasury_account;
        **sol_treasury_account = SolTreasuryAccount::new(SolTreasuryAccountInitArgs {
            bump: ctx.bumps.sol_treasury_account,
            lamports_per_pixel: params.lamports_per_pixel,
        })?;
        emit!(SolTreasuryAccountCreated {
            bump: sol_treasury_account.bump,
            treasury: sol_treasury_account.treasury,
            lamports_per_pixel: sol_treasury_account.lamports_per_pixel
        });
        Ok(())
    }
}
