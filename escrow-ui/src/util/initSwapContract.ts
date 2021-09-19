import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

import {
  tokenAPubKeyString,
  tokenBPubKeyString,
  tokenCPubKeyString,
  accPrivKeyByteArr,
  tokenAUserAcc,
  tokenBUserAcc,
  tokenCUserAcc,
  tokenAmount
} from "./const";

const connection = new Connection(
  "https://api.devnet.solana.com",
  "singleGossip"
);

export const initSwapCont = async (
  programId: string = "CiJkL1zKPSfaA9nahzqQk8VYtbyp5WdYxDQhQfMoosnR"
) => {
  const privateKeyDecoded = accPrivKeyByteArr.split(",").map(s => parseInt(s));
  const initializerAccount = new Account(privateKeyDecoded);

  const swapTokenAccount = new Account();
  const swapTokenProgramId = new PublicKey(programId);

  const createSwapTokenIx = SystemProgram.createAccount({
    space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      ESCROW_ACCOUNT_DATA_LAYOUT.span,
      "singleGossip"
    ),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: swapTokenAccount.publicKey,
    programId: swapTokenProgramId
  });

  const tokenAinitializer = new PublicKey(tokenAUserAcc);
  const tokenBinitializer = new PublicKey(tokenBUserAcc);
  const tokenCinitializer = new PublicKey(tokenCUserAcc);

  const tokenA = new PublicKey(tokenAPubKeyString);
  const tokenB = new PublicKey(tokenBPubKeyString);
  const tokenC = new PublicKey(tokenCPubKeyString);

  //   token A transfer ACC
  const tempTokenAAccount = new Account();
  const createTempTokenAAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span,
      "singleGossip"
    ),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: tempTokenAAccount.publicKey
  });
  const initTempAAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    tokenA,
    tempTokenAAccount.publicKey,
    initializerAccount.publicKey
  );
  const transferXTokensAToTempAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    tokenAinitializer,
    tempTokenAAccount.publicKey,
    initializerAccount.publicKey,
    [],
    tokenAmount
  );

  //   token B transfer ACC
  const tempTokenBAccount = new Account();
  const createTempTokenBAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span,
      "singleGossip"
    ),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: tempTokenBAccount.publicKey
  });
  const initTempBAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    tokenB,
    tempTokenBAccount.publicKey,
    initializerAccount.publicKey
  );
  const transferXTokensBToTempAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    tokenBinitializer,
    tempTokenBAccount.publicKey,
    initializerAccount.publicKey,
    [],
    tokenAmount
  );

  //   token C transfer ACC
  const tempTokenCAccount = new Account();
  const createTempTokenCAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span,
      "singleGossip"
    ),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: tempTokenCAccount.publicKey
  });
  const initTempCAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    tokenC,
    tempTokenCAccount.publicKey,
    initializerAccount.publicKey
  );
  const transferXTokensCToTempAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    tokenCinitializer,
    tempTokenCAccount.publicKey,
    initializerAccount.publicKey,
    [],
    tokenAmount
  );

  const initSwapTokenContIx = new TransactionInstruction({
    programId: swapTokenProgramId,
    keys: [
      {
        pubkey: initializerAccount.publicKey,
        isSigner: true,
        isWritable: false
      },
      { pubkey: tempTokenAAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: tempTokenBAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: tempTokenCAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: swapTokenAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
    ],
    data: Buffer.from(
      Uint8Array.of(3)
    )
  });

  const tx = new Transaction().add(
    createSwapTokenIx,
    createTempTokenAAccountIx,
    initTempAAccountIx,
    transferXTokensAToTempAccIx,
    createTempTokenBAccountIx,
    initTempBAccountIx,
    transferXTokensBToTempAccIx,
    createTempTokenCAccountIx,
    initTempCAccountIx,
    transferXTokensCToTempAccIx,
    initSwapTokenContIx
  );
  const res = await connection.sendTransaction(
    tx,
    [initializerAccount, tempTokenAAccount, tempTokenBAccount, tempTokenCAccount, swapTokenAccount],
    { skipPreflight: false, preflightCommitment: "singleGossip" }
  );

  return { 
    response: res
   };
};
