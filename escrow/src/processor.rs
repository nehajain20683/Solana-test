use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
};

use spl_token::state::Account as TokenAccount;

use crate::{error::EscrowError, instruction::EscrowInstruction, state::Escrow};

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = EscrowInstruction::unpack(instruction_data)?;

        match instruction {
            EscrowInstruction::InitSwapContract {} => {
                // EscrowInstruction::SwapTokens { amountA, amountB, amountC  } => {
                msg!("Instruction: init_swap");
                // Self::process_token_swap(accounts, amountA, amountB, amountC, program_id)
                Self::process_init_swap(accounts, program_id)
            }
            EscrowInstruction::SwapTokens {
                amountA,
                amountB,
                amountC,
                amountD,
                amountE,
            } => {
                // EscrowInstruction::SwapTokens { amountA } => {
                msg!("Instruction: SwapToken");
                Self::process_token_swap(
                    accounts, amountA, amountB, amountC, amountD, amountE, program_id,
                )
                // Self::process_token_swap(accounts, amountA, amountA/2, amountA/2, program_id)
                // Self::process_token_swap(accounts, amountA, program_id)
            }
            EscrowInstruction::AddToken {} => {
                // EscrowInstruction::SwapTokens { amountA } => {
                msg!("Instruction: SwapToken");
                Self::process_add_token_to_pda(accounts, program_id)
                // Self::process_token_swap(accounts, amountA, amountA/2, amountA/2, program_id)
                // Self::process_token_swap(accounts, amountA, program_id)
            }
        }
    }

    fn process_init_swap(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        let token_a_temp_account = next_account_info(account_info_iter)?;
        let token_b_temp_account = next_account_info(account_info_iter)?;
        let token_c_temp_account = next_account_info(account_info_iter)?;
        let swap_contract_account = next_account_info(account_info_iter)?;
        let rent = next_account_info(account_info_iter)?;
        let (pda, _bump_seed) = Pubkey::find_program_address(&[b"token_swap_pda"], program_id);

        let token_program = next_account_info(account_info_iter)?;
        let a_owner_change_ix = spl_token::instruction::set_authority(
            token_program.key,                                   //token_id
            token_a_temp_account.key, // account whose authority needs to change
            Some(&pda),               // new authority
            spl_token::instruction::AuthorityType::AccountOwner, // type of authority change
            initializer.key,          // current owner
            &[&initializer.key],      // public kets signing the CPI
        )?;

        msg!("Calling the token program to transfer token A account ownership...");
        invoke(
            &a_owner_change_ix,
            &[
                token_a_temp_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;

        let b_owner_change_ix = spl_token::instruction::set_authority(
            token_program.key,                                   //token_id
            token_b_temp_account.key, // account whose authority needs to change
            Some(&pda),               // new authority
            spl_token::instruction::AuthorityType::AccountOwner, // type of authority change
            initializer.key,          // current owner
            &[&initializer.key],      // public kets signing the CPI
        )?;

        msg!("Calling the token program to transfer token B account ownership...");
        invoke(
            &b_owner_change_ix,
            &[
                token_b_temp_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;

        let c_owner_change_ix = spl_token::instruction::set_authority(
            token_program.key,                                   //token_id
            token_c_temp_account.key, // account whose authority needs to change
            Some(&pda),               // new authority
            spl_token::instruction::AuthorityType::AccountOwner, // type of authority change
            initializer.key,          // current owner
            &[&initializer.key],      // public kets signing the CPI
        )?;

        msg!("Calling the token program to transfer token C account ownership...");
        invoke(
            &c_owner_change_ix,
            &[
                token_c_temp_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;

        Ok(())
    }

    fn process_add_token_to_pda(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let token_temp_account = next_account_info(account_info_iter)?;

        let rent = next_account_info(account_info_iter)?;
        let (pda, _bump_seed) = Pubkey::find_program_address(&[b"token_swap_pda"], program_id);

        let token_program = next_account_info(account_info_iter)?;
        let owner_change_ix = spl_token::instruction::set_authority(
            token_program.key,                                   //token_id
            token_temp_account.key, // account whose authority needs to change
            Some(&pda),             // new authority
            spl_token::instruction::AuthorityType::AccountOwner, // type of authority change
            initializer.key,        // current owner
            &[&initializer.key],    // public kets signing the CPI
        )?;

        msg!("Calling the token program to transfer token A account ownership...");
        invoke(
            &owner_change_ix,
            &[
                token_temp_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;

        Ok(())
    }

    fn process_token_swap(
        accounts: &[AccountInfo],
        amount_given_by_taker_for_A: u64,
        amount_expected_by_taker_for_B: u64,
        amount_expected_by_taker_for_C: u64,
        amount_expected_by_taker_for_D: u64,
        amount_expected_by_taker_for_E: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let taker = next_account_info(account_info_iter)?;
        if !taker.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if amount_given_by_taker_for_A
            != amount_expected_by_taker_for_B + amount_expected_by_taker_for_C + amount_expected_by_taker_for_D + amount_expected_by_taker_for_E
        {
            return Err(EscrowError::ExpectedAmountMismatch.into());
        }

        let takers_sending_token_A_account = next_account_info(account_info_iter)?;
        let takers_token_B_receive_account = next_account_info(account_info_iter)?;
        let takers_token_C_receive_account = next_account_info(account_info_iter)?;
        let takers_token_D_receive_account = next_account_info(account_info_iter)?;
        let takers_token_E_receive_account = next_account_info(account_info_iter)?;

        let pdas_temp_token_A_account = next_account_info(account_info_iter)?;
        let pdas_temp_token_B_account = next_account_info(account_info_iter)?;
        let pdas_temp_token_C_account = next_account_info(account_info_iter)?;
        let pdas_temp_token_D_account = next_account_info(account_info_iter)?;
        let pdas_temp_token_E_account = next_account_info(account_info_iter)?;

        let pdas_temp_token_A_account_info =
            TokenAccount::unpack(&pdas_temp_token_A_account.data.borrow())?;
        let pdas_temp_token_B_account_info =
            TokenAccount::unpack(&pdas_temp_token_B_account.data.borrow())?;
        let pdas_temp_token_C_account_info =
            TokenAccount::unpack(&pdas_temp_token_C_account.data.borrow())?;
        let pdas_temp_token_D_account_info =
            TokenAccount::unpack(&pdas_temp_token_D_account.data.borrow())?;
        let pdas_temp_token_E_account_info =
            TokenAccount::unpack(&pdas_temp_token_E_account.data.borrow())?;
        let (pda, bump_seed) = Pubkey::find_program_address(&[b"token_swap_pda"], program_id);
        // if amount_expected_by_taker_for_B <= pdas_temp_token_B_account_info.amount {
        //     return Err(EscrowError::ExpectedAmountMismatch.into());
        // }
        // if amount_expected_by_taker_for_C <= pdas_temp_token_C_account_info.amount {
        //     return Err(EscrowError::ExpectedAmountMismatch.into());
        // }

        let swap_contract_account = next_account_info(account_info_iter)?;

        let token_program = next_account_info(account_info_iter)?;

        let transfer_A_to_contract_pda_ix = spl_token::instruction::transfer(
            token_program.key,
            takers_sending_token_A_account.key,
            pdas_temp_token_A_account.key,
            taker.key,
            &[&taker.key],
            amount_given_by_taker_for_A,
        )?;
        msg!("Calling the token program to transfer token A to the pda's A token...");
        invoke(
            &transfer_A_to_contract_pda_ix,
            &[
                takers_sending_token_A_account.clone(),
                pdas_temp_token_A_account.clone(),
                taker.clone(),
                token_program.clone(),
            ],
        )?;

        let pda_account = next_account_info(account_info_iter)?;

        // // ------------------ ------------------

        let transfer_B_from_pda_to_taker_ix = spl_token::instruction::transfer(
            token_program.key,
            pdas_temp_token_B_account.key,
            takers_token_B_receive_account.key,
            pda_account.key,
            &[&pda_account.key],
            amount_expected_by_taker_for_B,
        )?;
        msg!("Calling the token program to transfer token B to the taker...");
        invoke_signed(
            &transfer_B_from_pda_to_taker_ix,
            &[
                pdas_temp_token_B_account.clone(),
                takers_token_B_receive_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[&b"token_swap_pda"[..], &[bump_seed]]],
        )?;
        // // -----------------------------
        let transfer_C_from_pda_to_taker_ix = spl_token::instruction::transfer(
            token_program.key,
            pdas_temp_token_C_account.key,
            takers_token_C_receive_account.key,
            pda_account.key,
            &[&pda_account.key],
            amount_expected_by_taker_for_C,
        )?;
        msg!("Calling the token program to transfer token C to the taker...");
        invoke_signed(
            &transfer_C_from_pda_to_taker_ix,
            &[
                pdas_temp_token_C_account.clone(),
                takers_token_C_receive_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[&b"token_swap_pda"[..], &[bump_seed]]],
        )?;

        // // -----------------------------
        let transfer_D_from_pda_to_taker_ix = spl_token::instruction::transfer(
            token_program.key,
            pdas_temp_token_D_account.key,
            takers_token_D_receive_account.key,
            pda_account.key,
            &[&pda_account.key],
            amount_expected_by_taker_for_D,
        )?;
        msg!("Calling the token program to transfer token D to the taker...");
        invoke_signed(
            &transfer_D_from_pda_to_taker_ix,
            &[
                pdas_temp_token_D_account.clone(),
                takers_token_D_receive_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[&b"token_swap_pda"[..], &[bump_seed]]],
        )?;

        // // -----------------------------
        let transfer_E_from_pda_to_taker_ix = spl_token::instruction::transfer(
            token_program.key,
            pdas_temp_token_E_account.key,
            takers_token_E_receive_account.key,
            pda_account.key,
            &[&pda_account.key],
            amount_expected_by_taker_for_E,
        )?;
        msg!("Calling the token program to transfer token E to the taker...");
        invoke_signed(
            &transfer_E_from_pda_to_taker_ix,
            &[
                pdas_temp_token_E_account.clone(),
                takers_token_E_receive_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[&b"token_swap_pda"[..], &[bump_seed]]],
        )?;

        Ok(())
    }
}
