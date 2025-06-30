use crate::{
    constants::{DATA_MAX_LEN, VERSION},
    helpers::get_current_epoch_and_slot,
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreatePixelsAccountParams {
    pub tweet: bool,
    pub nonce: u16,
    pub data: Vec<u8>,
}

#[account]
#[derive(InitSpace)]
pub struct PixelsAccount {
    pub bump: u8,                // PDA bump
    pub version: u8, // versioning, mainly intended for filtering out deprecated accounts
    pub nonce: u16,  // nonce required for tracking failed txes
    pub lamports_per_pixel: u64, // pixel cost
    pub burn: bool,  // (SPL only) whether tokens were burned
    pub epoch: u64,  // if caching is implemented this is our basis for "quick syncing"
    pub slot: u64,   // sorting & timelapse feature
    pub id: Pubkey,  // seed needed for pda uniqueness
    pub metadata: Pubkey, // metadata account id
    pub mint: Pubkey, // means of payment
    #[max_len(DATA_MAX_LEN)]
    pub data: Vec<u8>, // pixel(s) layout stored as [x,y,R,G,B]
}

pub struct PixelsAccountInitArgs<'a> {
    pub bump: u8,
    pub lamports_per_pixel: u64,
    pub burn: bool,
    pub id: Pubkey,
    pub metadata: Pubkey,
    pub mint: Pubkey,
    pub params: &'a CreatePixelsAccountParams,
}

impl PixelsAccount {
    /// instantiate the metadata account with provided args
    pub fn new(args: PixelsAccountInitArgs) -> Result<Self> {
        let (epoch, slot) = get_current_epoch_and_slot();
        let PixelsAccountInitArgs {
            bump,
            lamports_per_pixel,
            burn,
            id,
            metadata,
            mint,
            params,
        } = args;
        let CreatePixelsAccountParams { nonce, data, .. } = params;
        Ok(Self {
            bump,
            nonce: *nonce,
            lamports_per_pixel,
            burn,
            version: VERSION,
            epoch,
            slot,
            id,
            metadata,
            mint,
            data: data.clone(),
        })
    }
}
