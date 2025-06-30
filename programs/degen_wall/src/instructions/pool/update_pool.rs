use crate::{
    constants::{SEED_PREFIX, VERSION},
    errors::ErrorCode,
    events::PoolAccountUpdated,
    helpers::validate_authority,
    state::{PoolAccount, UpdatePoolAccountParams},
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct UpdatePoolAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account()]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), mint.key().as_ref()],
        bump
    )]
    pub pool_account: Account<'info, PoolAccount>,
}

impl UpdatePoolAccount<'_> {
    pub fn validate(&self, ctx: &Context<Self>) -> Result<()> {
        validate_authority(&ctx.accounts.signer)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx))]
    pub fn update_pool_account(
        ctx: Context<UpdatePoolAccount>,
        params: UpdatePoolAccountParams,
    ) -> Result<()> {
        // Update only if needed
        let pool_account = &mut ctx.accounts.pool_account;
        let mut is_update_needed = false;
        if pool_account.lamports_per_pixel != params.lamports_per_pixel {
            is_update_needed |= true;
            pool_account.lamports_per_pixel = PoolAccount::update_lamports_per_pixel(params.lamports_per_pixel)?;
        }
        if pool_account.burn != params.burn {
            is_update_needed |= true;
            pool_account.burn = PoolAccount::update_burn(params.burn);
        }
        if !is_update_needed {
            return Err(error!(ErrorCode::ThisIsPointlessDude));
        }
        emit!(PoolAccountUpdated {
            lamports_per_pixel: pool_account.lamports_per_pixel,
            burn: pool_account.burn
        });
        Ok(())
    }
}
