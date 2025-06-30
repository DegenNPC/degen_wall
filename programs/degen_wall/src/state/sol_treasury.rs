use crate::{
    constants::{TREASURY_PUBKEY, VERSION},
    helpers::validate_lamports_amount,
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateSolTreasuryAccountParams {
    pub lamports_per_pixel: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateSolTreasuryAccountParams {
    pub lamports_per_pixel: u64,
}

#[account]
#[derive(InitSpace)]
pub struct SolTreasuryAccount {
    pub bump: u8,                // PDA bump
    pub version: u8, // versioning, mainly intended for filtering out deprecated accounts
    pub treasury: Pubkey, // address to send the payment to
    pub lamports_per_pixel: u64, // pixel sol price
}

pub struct SolTreasuryAccountInitArgs {
    pub bump: u8,
    pub lamports_per_pixel: u64,
}

impl SolTreasuryAccount {
    /// instantiate the sol treasury account with provided args
    pub fn new(args: SolTreasuryAccountInitArgs) -> Result<Self> {
        validate_lamports_amount(args.lamports_per_pixel)?;
        Ok(Self {
            bump: args.bump,
            version: VERSION,
            treasury: TREASURY_PUBKEY,
            lamports_per_pixel: args.lamports_per_pixel,
        })
    }

    // update sol treasury pixel cost
    pub fn update_lamports_per_pixel(lamports_per_pixel: u64) -> Result<u64> {
        validate_lamports_amount(lamports_per_pixel)?;
        Ok(lamports_per_pixel)
    }
}
