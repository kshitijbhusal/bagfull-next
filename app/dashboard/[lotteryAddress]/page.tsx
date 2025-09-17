"use client"

import DashLotteryCard from "@/components/DashLotteryCard"
import { useProgram } from "@/lib/useProgram"
import { BN } from "@project-serum/anchor"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const dashboard = () => {
    const { lotteryAddress }: any = useParams()
    // const lotteryPDA = new PublicKey(lotteryAddress)
    const program = useProgram()
    const wallet = useAnchorWallet()
    // const ACCOUNT_ADDRESS = new PublicKey(lotteryAddress)
    const ACCOUNT_ADDRESS = lotteryAddress;

    const [tickets, setTickets] = useState<any>()
    const [lottery, setLottery] = useState<any>()
    const [lotteryWinnerList, setLotteryWinnerList] = useState<any>()

    const PROGRAM_ID = new PublicKey("G9fnVkph8qGQUNmLhhvj5BpsZfwVSNvUHDKi2E1YSzn8");

    useEffect(() => { getSingleLottery() }, [])
    async function getSingleLottery() {
        const lottery = await program.account.lottery.fetch(ACCOUNT_ADDRESS)
        setLottery(lottery)
        console.log(lottery)
    }


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
        setLotteryWinnerList("")

    }
    const winnersList: any = [];



    const drawWinners = async () => {

        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        }

        const ticketsNumber = tickets.length;
        const winnersNumber = ticketsNumber * 0.25

        console.log(ticketsNumber, winnersNumber, tickets);


        for (let i = 0; i < winnersNumber; i++) {
            const rand = Math.floor(Math.random() * ticketsNumber)
            winnersList.push((tickets[rand]).account.ticketOwner)
        }
        console.log(winnersList)


        const vaultAddress = new PublicKey(lotteryAddress); //-----------------------------



        try {
            const lotteryName = lottery.name

            const [lotteryPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("lottery"), Buffer.from(lotteryName)],
                PROGRAM_ID
            );


            const [winnerPDA, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from("winner"), wallet.publicKey.toBuffer(), lotteryPDA.toBuffer()],
                PROGRAM_ID
            );
            console.log('winnerPDA is', winnerPDA, lotteryName);


            const tx = await program.methods
                .drawWinners(lotteryName, lotteryPDA, vaultAddress, new BN(40), winnersList)
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


    const getWinnersList = async () => {
        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        }

        const winnersList = await program.account.winner.all()
        setTickets("")
        setLotteryWinnerList(winnersList)
        console.log('this are the winnersList', winnersList);

    }
    if (!lottery) {
        return <p>Loading</p>
    }

    // console.log(lottery.name)
    return (

        <>
            <section className="max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4  flex flex-col  gap-x-8 gap-y-8">

                <div>
                    <p className="text-4xl ">Dashboard  </p>
                    {lottery &&
                        <div><DashLotteryCard data={lottery} />
                        </div>
                    }
                </div>



                <div className="flex justify-around w-full ">
                    <button onClick={fetchAllTickets} className="border border-neutral-200/40 text-white px-2 py-1 rounded-md hover:shadow-purple-500/20 cursor-pointer hover:scale-105 transition  duration-300"> All Tickets</button>
                    {lottery.isDrawn && (
                        <button onClick={getWinnersList} className="bg-lime-600 text-white px-2 py-1 rounded-md hover:shadow-purple-500/20 cursor-pointer hover:scale-105">Lottery Winners</button>
                    )}

                    {!lottery.isDrawn && (
                        <button onClick={drawWinners} className="bg-green-800 text-white rounded-md px-2 py-2 hover:shadow-purple-500/20 cursor-pointer hover:scale-105">Draw Winners</button>
                    )}
                </div>


                {lotteryWinnerList && (
                    <div>
                        {lotteryWinnerList.map((data: any, index: any) => {
                            return (
                                <div key={index} className="bg-gradient-to-r from-neutral-800/40  to-purple-500/40 rounded-xl p-6 shadow-xl border border-yellow-300/40 max-w-5xl mx-auto mb-4">
                                    <section className="text-center mb-6">
                                        <div className="flex justify-center items-center gap-2 text-yellow-500">

                                            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                                                Congratulations Winners 🎉
                                            </h1>

                                        </div>
                                        <p className="mt-2 text-lg text-white/90 font-medium">
                                            Prize: <span className="text-yellow-300 font-bold text-xl">{data.account.amount.toNumber()} </span>
                                        </p>
                                    </section>

                                    <div className="grid gap-4">
                                        {data.account.winners.map((winnerPubkey:any, index:any) => {
                                            return (
                                                <div key={index } className="flex items-center gap-8 bg-neutral-500/20 px-8 py-2 rounded-xl shadow-lg hover:scale-[1.02] transition transform duration-300 ">
                                                    <p className="text-neutral-200/80" >{index + 1} </p>
                                                    <img
                                                        src="https://api.dicebear.com/7.x/identicon/svg?seed=winner1"
                                                        alt="winner"
                                                        className="size-8 rounded-full border-2 border-yellow-400 shadow-md"
                                                    />
                                                    
                                                    <p className="font-mono text-sm md:text-base text-neutral-200/80 break-all">
                                                        {winnerPubkey.toBase58()} 
                                                    </p>
                                                </div>

                                            )
                                        })}

                                    </div>

                                    <div className="m-2 p-2 flex justify-end">
                                    <button className=" font-semibold text-base bg-gradient-to-r from-purple-500/50 to-blue-600/50 rounded-md p-2 hover:scale-105 cursor-pointer text-neutral-200" >Initiate Payout </button>
                                    </div>
                                </div>



                            )
                        })}
                    </div>
                )}



                {tickets && (
                    <div className="">
                        <div className="bg-gradient-to-r from-neutral-800/40  to-purple-500/40 rounded-xl p-6 shadow-xl border border-yellow-300/40 max-w-5xl mx-auto mb-4">
                            <div className="overflow-hidden   mx-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-700/20 to-gray-600/20">
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
                                    <tbody className="divide-y divide-gray-700">

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

                )}


            </section>
        </>
    )
}

export default dashboard;