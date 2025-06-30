use anchor_lang::{prelude::*, solana_program::pubkey};

#[constant]
pub const SEED_PREFIX: &[u8] = b"degen_wall";
#[constant]
pub const WSOL_PUBKEY: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
#[constant]
pub const AUTHORITY_PUBKEY: Pubkey = pubkey!("F51Rn9VgBSTTuKDHtUBWs7G81kz7hNpLgo8K9n1ANPNR");
#[constant]
pub const TREASURY_PUBKEY: Pubkey = pubkey!("9QStWMdgxtqt9HMyVxzFSv7yWV1AFCdsMcMiKaqbqFEz");
#[constant]
pub const VERSION: u8 = 1;
#[constant]
pub const PX_WIDTH: u8 = 255;
#[constant]
pub const PX_HEIGHT: u8 = 128;
#[constant]
pub const MAX_PX_NR: u8 = 124;
#[constant]
pub const PX_SIZE: u8 = 5;
#[constant]
pub const DATA_MAX_LEN: u16 = MAX_PX_NR as u16 * PX_SIZE as u16;
#[constant]
pub const TWITTER_MAX_LEN: u8 = 15;
#[constant]
pub const NAME_MAX_LEN: u8 = 30;
#[constant]
pub const TICKER_MAX_LEN: u8 = 10;
#[constant]
pub const SOCIALS_MAX_LEN: u16 = 872;
#[constant]
pub const STRING_DELIMITER: &str = "|";

pub const SOCIALS_COUNT: u8 = 7;

pub const STRING_MAX_LEN: usize = SOCIALS_MAX_LEN as usize + (SOCIALS_COUNT - 1) as usize;
