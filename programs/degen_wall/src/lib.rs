#![allow(unexpected_cfgs)]
pub mod constants;
pub mod errors;
pub mod events;
pub mod helpers;
pub mod instructions;
pub mod state;

use anchor_lang::{prelude::*, solana_program::pubkey::Pubkey};

pub use instructions::*;

pub use state::{
    metadata::CreateMetadataAccountParams,
    pixels::CreatePixelsAccountParams,
    pool::{CreatePoolAccountParams, UpdatePoolAccountParams},
    sol_treasury::{CreateSolTreasuryAccountParams, UpdateSolTreasuryAccountParams},
};

#[allow(unused_imports)]
use solana_security_txt::security_txt;

declare_id!("DEGENvq96VhCR8jawM9ZkBuQtGtFNTsER4ohGPkFBLUt");

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Degen Wall",
    project_url: "https://degenwall.io",
    contacts: "https://t.me/degenwall",
    policy: "https://t.me/degenwall",
    preferred_languages: "en",
    source_code: "https://github.com/DegenNPC/degen_wall"
}

#[program]
pub mod degen_wall {

    use super::*;

    pub fn create_metadata_account(
        ctx: Context<CreateMetadataAccount>,
        params: CreateMetadataAccountParams,
    ) -> Result<()> {
        CreateMetadataAccount::create_metadata_account(ctx, params)
    }

    pub fn create_pixels_account(
        ctx: Context<CreatePixelsAccount>,
        params: CreatePixelsAccountParams,
    ) -> Result<()> {
        CreatePixelsAccount::create_pixels_account(ctx, params)
    }

    pub fn create_pool_account(
        ctx: Context<CreatePoolAccount>,
        params: CreatePoolAccountParams,
    ) -> Result<()> {
        CreatePoolAccount::create_pool_account(ctx, params)
    }

    pub fn create_sol_treasury_account(
        ctx: Context<CreateSolTreasuryAccount>,
        params: CreateSolTreasuryAccountParams,
    ) -> Result<()> {
        CreateSolTreasuryAccount::create_sol_treasury_account(ctx, params)
    }

    pub fn update_pool_account(
        ctx: Context<UpdatePoolAccount>,
        params: UpdatePoolAccountParams,
    ) -> Result<()> {
        UpdatePoolAccount::update_pool_account(ctx, params)
    }

    pub fn update_sol_treasury_account(
        ctx: Context<UpdateSolTreasuryAccount>,
        params: UpdateSolTreasuryAccountParams,
    ) -> Result<()> {
        UpdateSolTreasuryAccount::update_sol_treasury_account(ctx, params)
    }

    pub fn delete_pool_account(ctx: Context<DeletePoolAccount>) -> Result<()> {
        DeletePoolAccount::delete_pool_account(ctx)
    }
}
