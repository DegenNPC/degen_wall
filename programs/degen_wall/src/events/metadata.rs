use anchor_lang::prelude::*;

#[event]
pub struct MetadataAccountCreated {
    pub bump: u8,
    pub version: u8,
    pub epoch: u64,
    pub slot: u64,
    pub id: Pubkey,
    pub payer: Pubkey,
    pub token: Pubkey,
    pub name: String,
    pub ticker: String,
    pub website: String,
    pub twitter: String,
    pub community: String,
    pub image: String,
    pub description: String,
}
