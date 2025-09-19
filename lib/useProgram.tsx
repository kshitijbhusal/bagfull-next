"use client"
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { type Idl } from "@project-serum/anchor"
import idl from "./idl.json"

import PROGRAM_ID from "./constants"

export const useProgram = () => {
    
    const {connection} = useConnection()
    const wallet = useAnchorWallet()

    const provider = new AnchorProvider(connection, wallet as Wallet, {
        preflightCommitment:"confirmed"
    })

    return new Program(idl as Idl, PROGRAM_ID, provider)
}