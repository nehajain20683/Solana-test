import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { tokenAPubKeyString, tokenBPubKeyString, tokenCPubKeyString, tokenAmount, tokenAUserAcc, tokenBUserAcc, tokenCUserAcc, accPrivKeyByteArr } from "./const";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

const connection = new Connection("https://api.devnet.solana.com", 'singleGossip');

export const transferToken = async (

    source: string, // program ID of the contract
    destination: string, // program ID of the contract

) => {

    const privateKeyDecoded = accPrivKeyByteArr.split(',').map(s => parseInt(s));
    const initializerAccount = new Account(privateKeyDecoded);

    const sourceId = new PublicKey(source)
    const destinationId = new PublicKey(destination)
    //@ts-expect-error
    const sourceMintAccountPubkey = new PublicKey((await connection.getParsedAccountInfo(sourceId, 'singleGossip')).value!.data.parsed.info.mint);
    //@ts-expect-error
    const destinationMintAccountPubkey = new PublicKey((await connection.getParsedAccountInfo(destinationId, 'singleGossip')).value!.data.parsed.info.mint);

    if (sourceMintAccountPubkey.toString() !== destinationMintAccountPubkey.toString()) {
        throw "Wrong address"
        return
    }

    const transferXTokenAToTempAccAIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, sourceId, destinationId, initializerAccount.publicKey, [], tokenAmount);

    const tx = new Transaction()
        .add(transferXTokenAToTempAccAIx);

    await connection.sendTransaction(tx, [initializerAccount], { skipPreflight: false, preflightCommitment: 'singleGossip' });

    return {
        contractTokenA: "tempTokenAAccount.publicKey.toBase58()",
        contractTokenB: "tempTokenBAccount.publicKey.toBase58()",
        contractTokenC: "tempTokenCAccount.publicKey.toBase58()"
    };
}
