use solana_program::program_error::ProgramError;
use std::convert::TryInto;

use crate::error::EscrowError::InvalidInstruction;

pub enum EscrowInstruction {
        // MY FUNCTION -------------------------------------------------------
    /// Accepts a trade
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` The account of the person taking the trade
    /// 1. `[writable]` The taker's token A account
    /// 2. `[writable]` The taker's token B account
    /// 3. `[writable]` The taker's token C account
    /// 4. `[writable]` The taker's token D account
    /// 5. `[writable]` The taker's token E account
    /// 6. `[writable]` Contract PDA token A account (probably pool)
    /// 7. `[writable]` Contract PDA token B account (probably pool)
    /// 8. `[writable]` Contract PDA token C account (probably pool)
    /// 9. `[writable]` Contract PDA token D account (probably pool)
    /// 10. `[writable]` Contract PDA token E account (probably pool)
    /// 11. `[writable]` Contract account
    /// 12. `[]` The token program
    /// 13. `[]` PDA account
    SwapTokens {
        /// the amount the taker expects to be paid in the other token, as a u64 because that's the max possible supply of a token
        amountA: u64,
        amountB: u64,
        amountC: u64,
        amountD: u64,
        amountE: u64
    },

     // MY FUNCTION -------------------------------------------------------
    /// Initialize swap contract and PDA
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` The account of the person initializing contract and should have tokens associated with account
    /// 1. `[writable]` Initializer token A temp account - to be transfered to PDA
    /// 2. `[writable]` Initializer token B temp account - to be transfered to PDA
    /// 3. `[writable]` Initializer token C temp account - to be transfered to PDA
    /// 4. `[writable]` The contract, it will hold all necessary info about the trade.
    /// 5. `[]` The rent sysvar
    /// 6. `[]` The token program
    InitSwapContract {},

    // MY FUNCTION -------------------------------------------------------
    /// Add token to contract PDA
    ///
    ///
    /// Accounts expected:
    ///
    /// 0. `[signer]` The account of the person initializing contract and should have tokens associated with account
    /// 1. `[writable]` Initializer token temp account - to be transfered to PDA
    /// 2. `[]` The rent sysvar
    /// 3. `[]` The token program
    AddToken {},
}

impl EscrowInstruction {
    /// Unpacks a byte buffer into a [EscrowInstruction](enum.EscrowInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            2 => Self::SwapTokens {
                amountA: Self::unpack_amount(rest)?,
                amountB: Self::unpack_amount_2(rest)?,
                amountC: Self::unpack_amount_3(rest)?,
                amountD: Self::unpack_amount_4(rest)?,
                amountE: Self::unpack_amount_5(rest)?
            },
            3 => Self::InitSwapContract {},
            4 => Self::AddToken {},
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    fn unpack_amount_2(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(8..16)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    fn unpack_amount_3(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(16..24)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    fn unpack_amount_4(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(24..32)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    fn unpack_amount_5(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(32..)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
}
