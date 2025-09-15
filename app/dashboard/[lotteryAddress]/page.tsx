"use client"

import { useProgram } from "@/lib/useProgram"
import { BN } from "@project-serum/anchor"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { useParams } from "next/navigation"
import { useState } from "react"

const dashboard = () => {
    const { lotteryAddress }: any = useParams()
    // const lotteryPDA = new PublicKey(lotteryAddress)
    const program = useProgram()
    const wallet = useAnchorWallet()

    const [tickets, setTickets] = useState<any>([])


    const PROGRAM_ID = new PublicKey("Awn86VJSY4PW48dpGeDtXNsbiQZqcrfNgamobE6ER8sJ");


    const fetchAllTickets = async () => {
        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        }

        // console.log(wallet.publicKey.toBase58());


        const ticketAccounts = await program.account.ticket.all([
            // {
            //     memcmp:{
            //         offset:8,
            //         bytes: lotteryAddress
            //     }
            // }
        ]);

        console.log(ticketAccounts);
        setTickets(ticketAccounts)

    }
    const winnersList: any = []



    const drawWinners = async () => {

        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        }

        const ticketsNumber = tickets.length;
        const winnersNumber = ticketsNumber * 0.25

        for (let i = 0; i < winnersNumber; i++) {
            const rand = Math.floor(Math.random() * 10)
            winnersList.push((tickets[rand]).account.ticketOwner)
        }
        console.log(winnersList)

                         
        const vaultAddress = new PublicKey(lotteryAddress); //-----------------------------



        try {
            const lotteryName = "Dami" //-----------------------------

            const [lotteryPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("lottery"), Buffer.from(lotteryName)],
                PROGRAM_ID
            );


            const [winnerPDA, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("winner"), wallet.publicKey.toBuffer(), lotteryPDA.toBuffer()],
                PROGRAM_ID
            );

            const tx = await program.methods
                .drawWinners(lotteryName, lotteryPDA, vaultAddress, new BN(30), winnersList)
                .accounts({
                    lotteryAccount: lotteryPDA,
                    winnerAccount: winnerPDA,
                    signer: wallet?.publicKey,
                    systemProgram: SystemProgram.programId

                })
                .rpc()

            console.log("Winners are drawn", tx)
            
            console.log("Winners are drawn")

        } catch (error) {
            console.log("error while drawing winners", error)

        }

    }


    return (

        <>
            <section className="max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4  flex flex-col  gap-x-8 gap-y-8">

                <div>
                    <p className="bg-yellow-500 text-4xl ">Dashboard / {lotteryAddress} </p>
                </div>



                <div className="flex justify-around w-full ">
                    <button onClick={fetchAllTickets} className="bg-blue-300 text-white px-2 py-1 rounded-md">See All Tickets</button>
                    <button className="bg-blue-300 text-white px-2 py-1 rounded-md">Winners</button>
                    <button onClick={drawWinners} className="bg-green-400 text-white rounded-md px-2 py-2 cursor-pointer hover:scale-1.5 ">Draw Winners</button>
                </div>




                <div className="">
                    <div className="bg-gray-800/90 backdrop-blur-sm  shadow-2xl border border-gray-700/50 rounded-md p-4 w-full mx-auto">
                        <div className="overflow-hidden  border border-gray-700 mx-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-700 to-gray-600">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider border-r border-gray-600 last:border-r-0">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider border-r border-gray-600 last:border-r-0">
                                            Tickets
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider border-r border-gray-600 last:border-r-0">
                                            Owner
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider border-r border-gray-600 last:border-r-0">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800/50 divide-y divide-gray-700">

                                    {tickets.map((ticket: any, index: any) => (
                                        <tr key={index} className="hover:bg-gray-700/50 transition-all duration-300 hover:translate-x-1 group">
                                            <td className="px-6 py-4 text-gray-300 font-mono text-sm border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                {ticket.account.ticketId.toNumber()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 font-mono text-sm border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                {/* {ticket.account.ticketId}  */}
                                                ticketAddress
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                {ticket.account.ticketOwner.toBase58()}
                                            </td>
                                            <td className="px-6 py-4 border-r border-gray-700/50 last:border-r-0">Verified
                                            </td>
                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default dashboard;