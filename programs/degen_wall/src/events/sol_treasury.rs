use anchor_lang::prelude::*;

#[event]
pub struct SolTreasuryAccountCreated {
    pub bump: u8,
    pub treasury: Pubkey,
    pub lamports_per_pixel: u64,
}

#[event]
pub struct SolTreasuryAccountUpdated {
    pub lamports_per_pixel: u64,
}
