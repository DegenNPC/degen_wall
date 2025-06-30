use anchor_lang::prelude::*;

#[event]
pub struct PixelsAccountCreated {
    pub bump: u8,
    pub version: u8,
    pub nonce: u16,
    pub lamports_per_pixel: u64,
    pub burn: bool,
    pub tweet: bool,
    pub epoch: u64,
    pub slot: u64,
    pub id: Pubkey,
    pub metadata: Pubkey,
    pub mint: Pubkey,
    pub data: Vec<u8>,
}
