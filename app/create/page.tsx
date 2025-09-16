"use client"

import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "@/lib/useProgram";
import { BN } from "@project-serum/anchor";




function create() {

    const wallet = useAnchorWallet();
    const program = useProgram();


    const PROGRAM_ID = new PublicKey("G9fnVkph8qGQUNmLhhvj5BpsZfwVSNvUHDKi2E1YSzn8")




    const createLottery = async (e:any) => {
        e.preventDefault()
        if (!wallet?.publicKey) {
            console.error("Wallet not connected");
            return;
        }

        try {

            const lotteryName = "SuperteamNP Lottery"
            const [lotteryPda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("lottery"), Buffer.from(lotteryName)],
                PROGRAM_ID
            );

            console.log('lotteryPDA is', lotteryPda.toBase58());


            const tx = await program.methods
                .createLottery(lotteryName, new BN(6) )
                .accounts({
                    lotteryAccount: lotteryPda,
                    signer: wallet?.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Transaction successful:", tx);
        } catch (error) {
            console.error("Failed to create Todo:", error);
        }
    };





    return (
        <>
            <div className="max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4  flex flex-col  gap-x-8 gap-y-8" >
                <Link href={"/"} className=" border border-neutral-500  rounded-md p-2 absolute flex items-center b-6 " ><ArrowLeft /> Back</Link>
                <h1 className="text-center text-4xl">Create Your Own Lottery</h1>

                <form className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6 mx-auto">
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
                            className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium text-gray-300 mb-2"
                        >
                            Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            placeholder="Enter ticket price"
                            className="border border-gray-600 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={(e)=>{
                            createLottery(e)
                        }}
                        type="submit"
                        className="w-full bg-sky-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Create Lottery
                    </button>
                </form>
            </div>
        </>
    )
}


export default create;