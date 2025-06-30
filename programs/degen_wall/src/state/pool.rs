use crate::{constants::VERSION, helpers::validate_lamports_amount};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreatePoolAccountParams {
    pub lamports_per_pixel: u64,
    pub burn: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdatePoolAccountParams {
    pub lamports_per_pixel: u64,
    pub burn: bool,
}

#[account]
#[derive(InitSpace)]
pub struct PoolAccount {
    pub bump: u8,                // PDA bump
    pub version: u8, // versioning, mainly intended for filtering out deprecated accounts
    pub mint: Pubkey, // means of payment, SO111..2 for SOL
    pub vault_wsol: Pubkey, // DEX WSOL vault for calculating token price
    pub vault_mint: Pubkey, // DEX token vault for calculating token price
    pub treasury: Pubkey, // token account to send the payment to
    pub lamports_per_pixel: u64, // pixel sol price
    pub burn: bool,  // whether tokens should be burned instead of sent to treasury
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PoolAccountInitArgs {
    pub bump: u8,
    pub mint: Pubkey,
    pub vault_wsol: Pubkey,
    pub vault_mint: Pubkey,
    pub treasury: Pubkey,
    pub lamports_per_pixel: u64,
    pub burn: bool,
}

impl PoolAccount {
    /// instantiate the pool account with provided args
    pub fn new(args: PoolAccountInitArgs) -> Result<Self> {
        let PoolAccountInitArgs {
            bump,
            mint,
            vault_wsol,
            vault_mint,
            treasury,
            lamports_per_pixel,
            burn,
        } = args;
        validate_lamports_amount(lamports_per_pixel)?;
        Ok(Self {
            bump,
            version: VERSION,
            mint,
            vault_wsol,
            vault_mint,
            treasury,
            lamports_per_pixel,
            burn,
        })
    }

    // update pool pixel cost
    pub fn update_lamports_per_pixel(lamports_per_pixel: u64) -> Result<u64> {
        validate_lamports_amount(lamports_per_pixel)?;
        Ok(lamports_per_pixel)
    }

    // update pool burn
    pub fn update_burn(burn: bool) -> bool {
        burn
    }
}
