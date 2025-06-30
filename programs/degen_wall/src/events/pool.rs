use anchor_lang::prelude::*;

#[event]
pub struct PoolAccountCreated {
    pub bump: u8,
    pub mint: Pubkey,
    pub vault_wsol: Pubkey,
    pub vault_mint: Pubkey,
    pub treasury: Pubkey,
    pub lamports_per_pixel: u64,
    pub burn: bool,
}

#[event]
pub struct PoolAccountUpdated {
    pub lamports_per_pixel: u64,
    pub burn: bool,
}

#[event]
pub struct PoolAccountDeleted {
    pub mint: Pubkey,
}
