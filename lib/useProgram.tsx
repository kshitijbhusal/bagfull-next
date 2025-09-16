"use client"
import { AnchorProvider, Program } from "@project-serum/anchor"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { type Idl } from "@project-serum/anchor"
import idl from "./idl.json"

export const useProgram = () => {
    const {connection} = useConnection()
    const wallet = useAnchorWallet()
    const PROGRAM_ID = new PublicKey("G9fnVkph8qGQUNmLhhvj5BpsZfwVSNvUHDKi2E1YSzn8");

    const provider = new AnchorProvider(connection, wallet as any, {
        preflightCommitment:"confirmed"
    })

    return new Program(idl as Idl, PROGRAM_ID, provider)
}