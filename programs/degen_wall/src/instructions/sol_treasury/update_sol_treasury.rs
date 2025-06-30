use crate::{
    constants::{SEED_PREFIX, VERSION},
    errors::ErrorCode,
    events::SolTreasuryAccountUpdated,
    helpers::validate_authority,
    state::{SolTreasuryAccount, UpdateSolTreasuryAccountParams},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct UpdateSolTreasuryAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes()],
        bump = sol_treasury_account.bump
    )]
    pub sol_treasury_account: Account<'info, SolTreasuryAccount>,
}

impl UpdateSolTreasuryAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        validate_authority(&ctx.accounts.signer)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn update_sol_treasury_account(
        ctx: Context<UpdateSolTreasuryAccount>,
        params: UpdateSolTreasuryAccountParams,
    ) -> Result<()> {
        // Update only if needed
        let sol_treasury_account = &mut ctx.accounts.sol_treasury_account;
        if sol_treasury_account.lamports_per_pixel == params.lamports_per_pixel {
            return Err(error!(ErrorCode::ThisIsPointlessDude));
        }
        sol_treasury_account.lamports_per_pixel = SolTreasuryAccount::update_lamports_per_pixel(params.lamports_per_pixel)?;
        emit!(SolTreasuryAccountUpdated {
            lamports_per_pixel: sol_treasury_account.lamports_per_pixel,
        });
        Ok(())
    }
}
