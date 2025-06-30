use crate::{
    constants::{STRING_MAX_LEN, VERSION},
    helpers::get_current_epoch_and_slot,
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMetadataAccountParams {
    pub name: String,
    pub ticker: String,
    pub website: String,
    pub twitter: String,
    pub community: String,
    pub image: String,
    pub description: String,
}

#[account]
#[derive(InitSpace)]
pub struct MetadataAccount {
    pub bump: u8,      // PDA bump
    pub version: u8,   // versioning, mainly intended for filtering out deprecated accounts
    pub epoch: u64,    // if caching is implemented this is our basis for "quick syncing"
    pub slot: u64,     // sorting & timelapse feature
    pub id: Pubkey,    // seed needed for pda uniqueness
    pub payer: Pubkey, // who paid - stat tracking feature
    pub token: Pubkey, // address to display
    #[max_len(STRING_MAX_LEN)]
    pub socials: String, // easier to store all strings into 1 than reserving 4 bytes of offset for every string
}

pub struct MetadataAccountInitArgs<'a> {
    pub bump: u8,
    pub id: Pubkey,
    pub payer: Pubkey,
    pub token: Pubkey,
    pub params: &'a CreateMetadataAccountParams,
}

impl MetadataAccount {
    /// instantiate the metadata account with provided args
    pub fn new(args: MetadataAccountInitArgs) -> Result<Self> {
        let (epoch, slot) = get_current_epoch_and_slot();
        let MetadataAccountInitArgs {
            bump,
            id,
            payer,
            token,
            params,
        } = args;
        let CreateMetadataAccountParams {
            name,
            ticker,
            website,
            twitter,
            community,
            image,
            description,
        } = params;
        let socials = format!(
            "{}|{}|{}|{}|{}|{}|{}",
            name, ticker, website, twitter, community, image, description
        );
        Ok(Self {
            bump,
            version: VERSION,
            epoch,
            slot,
            id,
            payer,
            token,
            socials,
        })
    }
}
