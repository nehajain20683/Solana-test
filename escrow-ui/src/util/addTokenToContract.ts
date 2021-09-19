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

export const addToken = async (
  privKeyByteArrString: string = accPrivKeyByteArr,
  programId: string = "CiJkL1zKPSfaA9nahzqQk8VYtbyp5WdYxDQhQfMoosnR",
  initializerTokenAccString: string = "GGtbea8xorBwVGo8ZALDReNTZcqCqgX6RUD6RP8EJJLm",
  tokenPubKeyString: string = "CwvFgzUxUgMnTb9zCYBfCKgDMUeWNM8zvhDfBdFMrCJt", 
) => {
  const privateKeyDecoded = privKeyByteArrString.split(",").map(s => parseInt(s));
  const initializerAccount = new Account(privateKeyDecoded);

  const swapTokenProgramId = new PublicKey(programId);

  const tokeninitializer = new PublicKey(initializerTokenAccString);

  const token = new PublicKey(tokenPubKeyString);

  //   token A transfer ACC
  const tempTokenAccount = new Account();
  const createTempTokenAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span,
      "singleGossip"
    ),
    fromPubkey: initializerAccount.publicKey,
    newAccountPubkey: tempTokenAccount.publicKey
  });
  const initTempAAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    token,
    tempTokenAccount.publicKey,
    initializerAccount.publicKey
  );
  const transferXTokensAToTempAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    tokeninitializer,
    tempTokenAccount.publicKey,
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
      { pubkey: tempTokenAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
    ],
    data: Buffer.from(
      Uint8Array.of(4)
    )
  });

  const tx = new Transaction().add(
    createTempTokenAccountIx,
    initTempAAccountIx,
    transferXTokensAToTempAccIx,
    initSwapTokenContIx
  );
  const res = await connection.sendTransaction(
    tx,
    [initializerAccount, tempTokenAccount],
    { skipPreflight: false, preflightCommitment: "singleGossip" }
  );

  return { 
    response: res
   };
};
