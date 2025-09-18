"use client"

import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "@/lib/useProgram";
import { BN } from "@project-serum/anchor";
import PROGRAM_ID from "@/lib/constants";
import { useState } from "react";



function create() {

    const wallet = useAnchorWallet();
    const program = useProgram();
    const [lotteryName, setLotteryName] = useState("")
    const [lotteryPrice, setLotteryPrice] = useState("")




    const createLottery = async (e: any) => {
        e.preventDefault()
        if (!wallet?.publicKey) {
            console.error("Wallet not connected");
            return;
        }

        if(!lotteryName || !lotteryPrice){
            alert("Details not provided.")
            return;
        }

        try {




            //-------------------------------
            // derive vault PDA (linked to lottery)
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), Buffer.from(lotteryName)],
                PROGRAM_ID
            );

            const [lotteryPda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("lottery"), Buffer.from(lotteryName)],
                PROGRAM_ID
            );

            console.log("Vault PDA is", vaultPda.toBase58());

            // 2️⃣ create vault
            const tx2 = await program.methods
                .createVault(lotteryName, lotteryPda)
                .accounts({
                    vaultAccount: vaultPda,
                    signer: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Vault created in tx:", tx2);

          



            const tx1 = await program.methods
                .createLottery(lotteryName, new BN(1), vaultPda)
                .accounts({
                    lotteryAccount: lotteryPda,
                    signer: wallet?.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Transaction successful! Lottery Created", tx1);

            console.log('lotteryPDA is', lotteryPda.toBase58());





        } catch (error) {
            console.error("Failed to create Todo:", error);
        }
    };





    return (
        <>
            <div className="max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4  flex flex-col  gap-x-8 gap-y-8" >
                <Link href={"/"} className=" border border-neutral-500  rounded-md p-2 absolute flex items-center b-6 " ><ArrowLeft /> Back</Link>
                <h1 className="text-center text-4xl">Create Your Own Lottery</h1>

                <form className="bg-neutral-800/40 shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6 mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center">
                        Create Lottery
                    </h2>

                    {/* Lottery Name */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-300 mb-2"
                        >
                            Lottery Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter lottery name"
                            className="border border-gray-600 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e)=>setLotteryName(e.target.value)}
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium text-gray-300 mb-2"
                        >
                            Ticket Price (SOL)
                        </label>
                        <input
                            id="price"
                            type="number"
                            placeholder="Enter SOL amount"
                            className="border border-gray-600 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e)=>setLotteryPrice(e.target.value)}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={(e) => {
                            createLottery(e)
                        }}
                        type="submit"
                        className="w-fit px-2 cursor-pointer bg-sky-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Create Lottery
                    </button>
                </form>
            </div>
        </>
    )
}


export default create;