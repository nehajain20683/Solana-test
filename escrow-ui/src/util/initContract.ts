import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { tokenAPubKeyString, tokenBPubKeyString, tokenCPubKeyString, tokenAmount, tokenAUserAcc, tokenBUserAcc, tokenCUserAcc, accPrivKeyByteArr } from "./const";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

const connection = new Connection("https://api.devnet.solana.com", 'singleGossip');

export const initContract = async (
    programId: string, // program ID of the contract
) => {


    const contractId = new PublicKey(programId)

    const tokenA = new PublicKey(tokenAPubKeyString)
    const tokenAUser = new PublicKey(tokenAUserAcc)

    const tokenB = new PublicKey(tokenBPubKeyString)
    const tokenBUser = new PublicKey(tokenBUserAcc)

    const tokenC = new PublicKey(tokenCPubKeyString)
    const tokenCUser = new PublicKey(tokenCUserAcc)

    const privateKeyDecoded = accPrivKeyByteArr.split(',').map(s => parseInt(s));
    const initializerAccount = new Account(privateKeyDecoded);

    // --------------

    const tempTokenAAccount = new Account();
    const createTempTokenAAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: tempTokenAAccount.publicKey
    });

    const initTempTokenAIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, tokenA, tempTokenAAccount.publicKey, contractId);
    const transferXTokenAToTempAccAIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, tokenAUser, tempTokenAAccount.publicKey, initializerAccount.publicKey, [], tokenAmount);

    // ----------------

    const tempTokenBAccount = new Account();
    const createTempTokenBAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: tempTokenBAccount.publicKey
    });


    const initTempTokenBIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, tokenB, tempTokenBAccount.publicKey, contractId);
    const transferXTokenBToTempAccBIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, tokenBUser, tempTokenBAccount.publicKey, initializerAccount.publicKey, [], tokenAmount);

    // ----------------

    const tempTokenCAccount = new Account();
    const createTempTokenCAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: tempTokenCAccount.publicKey
    });

    const initTempTokenCIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, tokenC, tempTokenCAccount.publicKey, contractId);
    const transferXTokenCToTempAccCIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, tokenCUser, tempTokenCAccount.publicKey, initializerAccount.publicKey, [], tokenAmount);


    const tx = new Transaction()
        .add(
            createTempTokenAAccountIx,
            initTempTokenAIx,
            transferXTokenAToTempAccAIx,
            createTempTokenBAccountIx,
            initTempTokenBIx,
            transferXTokenBToTempAccBIx,
            createTempTokenCAccountIx,
            initTempTokenCIx,
            transferXTokenCToTempAccCIx);

    await connection.sendTransaction(tx, [initializerAccount, tempTokenAAccount, tempTokenBAccount, tempTokenCAccount], { skipPreflight: false, preflightCommitment: 'singleGossip' });

    return {
        contractTokenA: tempTokenAAccount.publicKey.toBase58(),
        contractTokenB: tempTokenBAccount.publicKey.toBase58(),
        contractTokenC: tempTokenCAccount.publicKey.toBase58(),
       };
}
