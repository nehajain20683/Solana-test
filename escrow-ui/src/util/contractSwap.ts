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
  receiverPrivKeyByteArr,
  tokenAPubKeyString,
  accPrivKeyByteArr,
  tokenAUserAcc,
  tokenAUserAcc_user2
} from "./const";

const connection = new Connection(
  "https://api.devnet.solana.com",
  "singleGossip"
);

export const swapTokenFromContract = async (
  privKeyByteArrString: string = receiverPrivKeyByteArr,
  programIdString: string = "CiJkL1zKPSfaA9nahzqQk8VYtbyp5WdYxDQhQfMoosnR",
  userTokenAString: string = "93CzoWhDWmxw15FRHhwAHjTGzGpELr7PzzvFds1YGowV",
  userTokenBString: string = "Gaj8RRAsdhAtLjUYtHMWjjKwvUrXoi6hjdNE8GxuFkK",
  userTokenCString: string = "6K6NoV9hBRqsZ5RENmK2FNeJZXDfQ9r5EaPQ3vQUGk5i",
  userTokenDString: string = "BFGnuYZN8oAUQH1maEyBsFvXrnsTEJY1EWBck2QnF5jq",
  userTokenEString: string = "DM6s2jisPmZvAVDznxvRw7qynLPcrv48ShqQHjTV6Fjc",
  pdaTokenAString: string = "9UwH2UtLvasyHPpDgh5TJWSbZ8QGyAjbwGFbME9miNw7",
  pdaTokenBString: string = "EEexpwitPM3rbRS1VUDfvarX4YRjaWM6CmGh5x21sXTE",
  pdaTokenCString: string = "6mBoC6f89T2pY6CuXxPDpJQyH1FZHPwxtiBPLcykbn6A",
  pdaTokenDString: string = "4vVRMUvLt4EvfJAvFgNs6wvZwfLaL9J6R87mh65xaeaf",
  pdaTokenEString: string = "9eiCUEhdX9sy7QstHsmqBJKS5P7hGuXLg9LGUn3WTsmq",
  contractAccountString: string = "6zcSB1syqfHvaCvg1NA8Dpycsh2dCaWjHCzCkVTPFhZq",

  sendAmountTokenA: number = 1000000000,
  tokenBPerc: number = 25,
  tokenCPerc: number = 25,
  tokenDPerc: number = 25,
  tokenEPerc: number = 25,
) => {
  const receiverKeyDecode = privKeyByteArrString
    .split(",")
    .map(s => parseInt(s));
  const receiverAccount = new Account(receiverKeyDecode);

  const programId = new PublicKey(programIdString);
  const userTokenA = new PublicKey(userTokenAString);
  const userTokenB = new PublicKey(userTokenBString);
  const userTokenC = new PublicKey(userTokenCString);
  const userTokenD = new PublicKey(userTokenDString);
  const userTokenE = new PublicKey(userTokenEString);
  const pdaTokenA = new PublicKey(pdaTokenAString);
  const pdaTokenB = new PublicKey(pdaTokenBString);
  const pdaTokenC = new PublicKey(pdaTokenCString);
  const pdaTokenD = new PublicKey(pdaTokenDString);
  const pdaTokenE = new PublicKey(pdaTokenEString);
  const contractAccount = new PublicKey(contractAccountString);

  const tokenBReceiveAmount = (sendAmountTokenA / 100) * tokenBPerc;
  const tokenCReceiveAmount = (sendAmountTokenA / 100) * tokenCPerc;
  const tokenDReceiveAmount = (sendAmountTokenA / 100) * tokenDPerc;
  const tokenEReceiveAmount = (sendAmountTokenA / 100) * tokenEPerc;

  const PDA = await PublicKey.findProgramAddress(
    [Buffer.from("token_swap_pda")],
    programId
  );

  console.log(`Buffer.from(
    Uint8Array.of(
      2,
      ...new BN(sendAmountTokenA).toArray("le", 8),
      ...new BN(tokenBReceiveAmount).toArray("le", 8),
      ...new BN(tokenCReceiveAmount).toArray("le", 8)
    )
  )`, Buffer.from(
    Uint8Array.of(
      2,
      ...new BN(1000000000).toArray("le", 8),
      ...new BN(500000000).toArray("le", 8),
      ...new BN(500000000).toArray("le", 8)
    )
  ))

  const contractTokenSwap = new TransactionInstruction({
    programId: programId,
    keys: [
      { pubkey: receiverAccount.publicKey, isSigner: true, isWritable: false },
      {
        pubkey: userTokenA,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: userTokenB,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: userTokenC,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: userTokenD,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: userTokenE,
        isSigner: false,
        isWritable: true
      },
      { pubkey: pdaTokenA, isSigner: false, isWritable: true },
      { pubkey: pdaTokenB, isSigner: false, isWritable: true },
      { pubkey: pdaTokenC, isSigner: false, isWritable: true },
      { pubkey: pdaTokenD, isSigner: false, isWritable: true },
      { pubkey: pdaTokenE, isSigner: false, isWritable: true },
      { pubkey: contractAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: PDA[0], isSigner: false, isWritable: false }
    ],
    data: Buffer.from(
      Uint8Array.of(
        2,
        ...new BN(sendAmountTokenA).toArray("le", 8),
        ...new BN(tokenBReceiveAmount).toArray("le", 8),
        ...new BN(tokenCReceiveAmount).toArray("le", 8),
        ...new BN(tokenDReceiveAmount).toArray("le", 8),
        ...new BN(tokenEReceiveAmount).toArray("le", 8)
      )
    )
  });

  const tx = new Transaction().add(contractTokenSwap);
  // .add(transferXTokenCToTempAccCIx);
  const res = await connection.sendTransaction(tx, [receiverAccount], {
    skipPreflight: false,
    preflightCommitment: "singleGossip"
  });

  return {
    response: res,
    done: true
  };
};

// ----------------------------
/**
 * import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout"; 

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const takeTrade = async (
    privateKeyByteArray: string,
    escrowAccountAddressString: string,
    takerXTokenAccountAddressString: string,
    takerYTokenAccountAddressString: string,
    takerExpectedXTokenAmount: number,
    programIdString: string,
) => {
    const takerAccount = new Account(privateKeyByteArray.split(',').map(s => parseInt(s)));
    const escrowAccountPubkey = new PublicKey(escrowAccountAddressString);
    const takerXTokenAccountPubkey = new PublicKey(takerXTokenAccountAddressString);
    const takerYTokenAccountPubkey = new PublicKey(takerYTokenAccountAddressString);
    const programId = new PublicKey(programIdString);

    let encodedEscrowState;
    try {
        encodedEscrowState = (await connection.getAccountInfo(escrowAccountPubkey, 'singleGossip'))!.data;
    } catch (err) {
        throw new Error("Could not find escrow at given address!")
    }
    const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
    const escrowState =  {
        escrowAccountPubkey: escrowAccountPubkey,
        isInitialized: !!decodedEscrowLayout.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
        XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
        initializerYTokenAccount: new PublicKey(decodedEscrowLayout.initializerReceivingTokenAccountPubkey),
        expectedAmount: new BN(decodedEscrowLayout.expectedAmount, 10, "le")
    };

    const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], programId);

    const exchangeInstruction = new TransactionInstruction({
        programId,
        data: Buffer.from(Uint8Array.of(1, ...new BN(takerExpectedXTokenAmount).toArray("le", 8))),
        keys: [
            { pubkey: takerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: takerYTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: takerXTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: escrowState.XTokenTempAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerYTokenAccount, isSigner: false, isWritable: true},
            { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false}
        ] 
    })    

    await connection.sendTransaction(new Transaction().add(exchangeInstruction), [takerAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
}

 */
