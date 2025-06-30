use crate::{
    constants::{SEED_PREFIX, VERSION},
    events::MetadataAccountCreated,
    helpers::validate_metadata_params,
    state::{CreateMetadataAccountParams, MetadataAccount, MetadataAccountInitArgs},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateMetadataAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: Just a way of assigning unique id
    #[account()]
    pub id: AccountInfo<'info>,

    #[account(
        init,
        payer = signer,
        space = MetadataAccount::DISCRIMINATOR.len() + MetadataAccount::INIT_SPACE,
        seeds = [SEED_PREFIX, &VERSION.to_le_bytes(), signer.key().as_ref(), id.key().as_ref()],
        bump
    )]
    pub metadata_account: Box<Account<'info, MetadataAccount>>,

    /// CHECK: This is stored as is, no other interactions
    #[account()]
    pub token: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

impl CreateMetadataAccount<'_> {
    pub fn validate(
        &self,
        _ctx: &Context<Self>,
        params: &CreateMetadataAccountParams,
    ) -> Result<()> {
        validate_metadata_params(params)?;
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&ctx, &params))]
    pub fn create_metadata_account(
        ctx: Context<CreateMetadataAccount>,
        params: CreateMetadataAccountParams,
    ) -> Result<()> {
        let signer = &ctx.accounts.signer;
        // Save metadata account
        let metadata_account = &mut *ctx.accounts.metadata_account;
        **metadata_account = MetadataAccount::new(MetadataAccountInitArgs {
            bump: ctx.bumps.metadata_account,
            id: ctx.accounts.id.key(),
            payer: signer.key(),
            token: ctx.accounts.token.key(),
            params: &params,
        })?;
        // Emit event
        emit!(MetadataAccountCreated {
            bump: metadata_account.bump,
            version: metadata_account.version,
            epoch: metadata_account.epoch,
            slot: metadata_account.slot,
            id: metadata_account.id,
            payer: metadata_account.payer,
            token: metadata_account.token,
            name: params.name,
            ticker: params.ticker,
            website: params.website,
            twitter: params.twitter,
            community: params.community,
            image: params.image,
            description: params.description,
        });
        Ok(())
    }
}
