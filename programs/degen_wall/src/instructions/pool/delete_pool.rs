use crate::{
    constants::{SEED_PREFIX, VERSION}, events::PoolAccountDeleted, helpers::validate_authority,
    state::PoolAccount,
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct DeletePoolAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account()]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        close = signer,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), mint.key().as_ref()],
        bump
    )]
    pub pool_account: Account<'info, PoolAccount>,
}

impl DeletePoolAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        validate_authority(&ctx.accounts.signer)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn delete_pool_account(ctx: Context<DeletePoolAccount>) -> Result<()> {
        emit!(PoolAccountDeleted {
            mint: ctx.accounts.mint.key()
        });
        Ok(())
    }
}
