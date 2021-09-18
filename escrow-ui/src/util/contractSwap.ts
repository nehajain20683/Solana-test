import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

import { receiverPrivKeyByteArr, tokenAPubKeyString, accPrivKeyByteArr, tokenAUserAcc, tokenAUserAcc_user2 } from './const'

const connection = new Connection("https://api.devnet.solana.com", 'singleGossip');

export const swapTokenFromContract = async (

    tokenAPubKeyString: string = 'Cga3rxzAeevcULSf7dnKwUwyecFcjD2kD1khTDyyfdfA',
    programId: string = '9T6jVSPKStciyeoPzJQnVyDW2aqEoti6w7AjNsqzFMBL',
    contractTokenAKey: string = 'CSEHmDfjyJcH8ijwoARnkZLkeMDdcXHdKQw17sBcy3ZU',
) => {

    const user1KeyDecode = accPrivKeyByteArr.split(',').map(s => parseInt(s));
    const user1Acc = new Account(user1KeyDecode);


    const receiverAccountKeyDecode = receiverPrivKeyByteArr.split(',').map(s => parseInt(s));
    const receiverAccount = new Account(receiverAccountKeyDecode);

    console.log("receiverAccount ", receiverAccount.publicKey.toString())

    console.log(tokenAPubKeyString)
    console.log(programId)
    console.log(contractTokenAKey)

    const contProgramId = new PublicKey(programId)
    console.log("contProgramId ", contProgramId.toString())

    const contTokenA = new PublicKey(contractTokenAKey)
    console.log("contTokenA ", contTokenA.toString())

    const tokenA = new PublicKey(tokenAPubKeyString)
    console.log("tokenA ", tokenA.toString())

    // --------------


    const user1tokenA = new PublicKey(tokenAUserAcc) 
    const user2tokenA = new PublicKey(tokenAUserAcc_user2)

    const transferXTokenCToTempAccCIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, user1tokenA, user2tokenA, user1Acc.publicKey, [], 10000);


    const contractTokenSwap = new TransactionInstruction({
        programId: contProgramId,
        keys: [
            { pubkey: receiverAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: user2tokenA, isSigner: false, isWritable: true },
            { pubkey: contTokenA, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: contProgramId, isSigner: false, isWritable: false },
        ],
        data: Buffer.from(Uint8Array.of(2, ...new BN(10000000).toArray("le", 8)))
    })

    const tx = new Transaction()
        .add(contractTokenSwap);
        // .add(transferXTokenCToTempAccCIx);
    await connection.sendTransaction(tx, [receiverAccount], { skipPreflight: false, preflightCommitment: 'singleGossip' });


    return {
        done: true
    };
}
