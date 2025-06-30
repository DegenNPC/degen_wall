use crate::{
    constants::{
        AUTHORITY_PUBKEY, DATA_MAX_LEN, MAX_PX_NR, NAME_MAX_LEN, PX_HEIGHT, PX_SIZE, PX_WIDTH,
        SOCIALS_COUNT, SOCIALS_MAX_LEN, STRING_DELIMITER, TICKER_MAX_LEN, TWITTER_MAX_LEN,
    },
    errors::ErrorCode,
    state::CreateMetadataAccountParams,
    CreatePixelsAccountParams,
};
use anchor_lang::prelude::*;
use std::collections::HashSet;

pub fn get_current_epoch_and_slot() -> (u64, u64) {
    let clock = Clock::get().unwrap();
    (clock.epoch, clock.slot)
}

pub fn calculate_px_nr(data: &[u8]) -> u16 {
    let mut total: u16 = 0;
    let chunks = data.chunks_exact(PX_SIZE as usize).collect::<Vec<_>>();

    for i in 0..chunks.len() {
        let chunk = chunks[i];
        let draw_from = chunk[1] & 0x80 != 0;

        let x = chunk[0] as usize;
        let y = (chunk[1] & 0x7F) as usize;
        let index = x + y * PX_WIDTH as usize;

        if draw_from && i + 1 < chunks.len() {
            let next_chunk = chunks[i + 1];
            let next_x = next_chunk[0] as usize;
            let next_y = (next_chunk[1] & 0x7F) as usize;
            let next_index = next_x + next_y * PX_WIDTH as usize;

            if next_index > index {
                total += (next_index - index) as u16;
            }
        } else {
            total += 1;
        }
    }
    total
}

pub fn calculate_sol_fee(data: &[u8], lamports_per_pixel: u64) -> u64 {
    let px_nr = calculate_px_nr(data) as usize;
    px_nr as u64 * lamports_per_pixel
}

pub fn merge_strings(args: &[&str]) -> String {
    args.join(STRING_DELIMITER)
}

pub fn validate_data(data: &[u8]) -> Result<()> {
    let length = data.len();
    if length == 0 {
        return Err(error!(ErrorCode::EmptyData));
    }
    if length > DATA_MAX_LEN as usize {
        return Err(error!(ErrorCode::DataTooBig));
    }
    if length % PX_SIZE as usize != 0 {
        return Err(error!(ErrorCode::InvalidData));
    }

    let mut seen_coords = HashSet::new();
    let mut prev_index = None;
    let total_chunks = length / PX_SIZE as usize;

    for (i, chunk) in data.chunks_exact(PX_SIZE as usize).enumerate() {
        let x = chunk[0];
        let y = chunk[1] & 0x7F;
        // Handle out-of-bounds
        if x >= PX_WIDTH || y >= PX_HEIGHT {
            return Err(error!(ErrorCode::InvalidData));
        }
        // Check for duplicate coordinate
        let coord = (x, y);
        if !seen_coords.insert(coord) {
            return Err(error!(ErrorCode::DuplicateCoordinate));
        }
        // Check index ordering
        let index = x as usize + y as usize * PX_WIDTH as usize;
        if let Some(prev) = prev_index {
            if index < prev {
                return Err(error!(ErrorCode::UnsortedData));
            }
        }
        // Last chunk y must not have MSB set
        if i == total_chunks - 1 && chunk[1] & 0x80 != 0 {
            return Err(error!(ErrorCode::InvalidData)); // or a specific error like LastChunkMSBSet
        }
        prev_index = Some(index);
    }
    Ok(())
}

pub fn validate_nonce(nonce: &u16) -> Result<()> {
    if *nonce > (PX_HEIGHT as u16 * PX_WIDTH as u16) / MAX_PX_NR as u16 {
        return Err(error!(ErrorCode::NonceTooHigh));
    }
    Ok(())
}

pub fn validate_url(url: &str) -> Result<()> {
    if url.starts_with("https://") || url.starts_with("http://") {
        return Err(error!(ErrorCode::NoHttpPrefix));
    }
    Ok(())
}

pub fn validate_twitter(twitter: &str) -> Result<()> {
    let length = twitter.len();
    if length < 1 {
        return Ok(());
    }
    if length > TWITTER_MAX_LEN as usize {
        return Err(error!(ErrorCode::TwitterStringTooBig));
    }
    let mut prev_char = '\0';
    for (i, ch) in twitter.chars().enumerate() {
        if !ch.is_alphanumeric() && ch != '_' {
            return Err(error!(ErrorCode::InvalidTwitter));
        }
        if (i == 0 || i == length - 1) && ch == '_' {
            return Err(error!(ErrorCode::InvalidTwitter));
        }
        if ch == '_' && prev_char == '_' {
            return Err(error!(ErrorCode::InvalidTwitter));
        }
        prev_char = ch;
    }
    Ok(())
}

pub fn validate_name(name: &str) -> Result<()> {
    let length = name.len();
    if length > NAME_MAX_LEN as usize {
        return Err(error!(ErrorCode::NameStringTooBig));
    }
    Ok(())
}

pub fn validate_ticker(ticker: &str) -> Result<()> {
    let length = ticker.len();
    if length > TICKER_MAX_LEN as usize {
        return Err(error!(ErrorCode::TickerStringTooBig));
    }
    Ok(())
}

pub fn validate_strl_len(args: [&String; SOCIALS_COUNT as usize]) -> Result<()> {
    let length: usize = args.iter().map(|s| s.len()).sum();
    if length > SOCIALS_MAX_LEN as usize {
        return Err(error!(ErrorCode::OverallStringTooBig));
    }
    Ok(())
}

pub fn validate_metadata_params(params: &CreateMetadataAccountParams) -> Result<()> {
    let CreateMetadataAccountParams {
        name,
        ticker,
        website,
        twitter,
        community,
        image,
        description,
    } = params;
    validate_name(name)?;
    validate_ticker(ticker)?;
    validate_url(website)?;
    validate_twitter(twitter)?;
    validate_url(community)?;
    validate_url(image)?;
    validate_strl_len([
        name,
        ticker,
        website,
        twitter,
        community,
        image,
        description,
    ])?;
    Ok(())
}

pub fn validate_pixels_params(params: &CreatePixelsAccountParams) -> Result<()> {
    let CreatePixelsAccountParams { data, nonce, .. } = params;
    validate_data(data)?;
    validate_nonce(nonce)?;
    Ok(())
}

pub fn validate_lamports_amount(lamports_per_pixel: u64) -> Result<()> {
    if lamports_per_pixel == 0 {
        return Err(error!(ErrorCode::LamportsAmountMustBeGreaterThan0));
    }
    Ok(())
}

pub fn validate_authority(signer: &Signer<'_>) -> Result<()> {
    if signer.key() != AUTHORITY_PUBKEY {
        return Err(error!(ErrorCode::YouAreNotMyBoss));
    }
    Ok(())
}

pub fn validate_treasury_account(
    treasury_public_key: &Pubkey,
    expected_treasury_public_key: &Pubkey,
) -> Result<()> {
    if treasury_public_key != expected_treasury_public_key {
        return Err(error!(ErrorCode::WhyAreYouDoingThisToMeBruv));
    }
    Ok(())
}

pub fn get_name_from_socials(socials: &str) -> String {
    socials.split('|').next().unwrap_or("").to_string()
}
