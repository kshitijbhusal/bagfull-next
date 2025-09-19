"use client"

import DashLotteryCard from "@/components/DashLotteryCard"
import { useProgram } from "@/lib/useProgram"
import { BN } from "@project-serum/anchor"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import PROGRAM_ID from "@/lib/constants"
import toast from "react-hot-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import type { Ticket, Lottery, Winner } from "@/types/types"


const Dashboard = () => {
    const { lotteryAddress }: { lotteryAddress: string } = useParams()
    const program = useProgram()
    const wallet = useAnchorWallet()


    const [tickets, setTickets] = useState<Ticket[] | null>(null)
    const [lottery, setLottery] = useState<Lottery | null>(null)
    const [lotteryWinnerList, setLotteryWinnerList] = useState<Winner[] | null>(null)



    useEffect(() => {
        getSingleLottery()
    }, [])



    async function getSingleLottery() {


        const lottery = await program.account.lottery.fetch(lotteryAddress)
        console.log('lottery ko type herna ', lottery)
        setLottery(lottery as Lottery)


    }


    useEffect(() => {
        fetchAllTickets()

    }, [lottery])

    const fetchAllTickets = async () => {
        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return;
        }

        if (!lottery) {
            console.log("Lottery Not found");
            return;

        }


        const ticketAccounts = await program.account.ticket.all([
            {
                memcmp: {
                    offset: 24,
                    //@ts-ignore :Anchor-generated account type is mismatched, lotteryPda exists on-chain
                    bytes: lottery.lotteryPda.toBase58(),
                }
            }
        ]);

        console.log('ticketAccounts herna type ko lagi ', ticketAccounts);
        setTickets(ticketAccounts as Ticket[])
        setLotteryWinnerList(null)

    }




    const drawWinners = async () => {

        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        }
        if (!lottery) {
            console.log("Lottery Not found");
            return;

        }


        if (!tickets || (tickets.length) < 4) {
            toast.error("Cann't Draw!: thickets are less than four.")
            return;
        }


        const ticketsNumber = tickets.length;
        const winnersNumber = ticketsNumber * 0.25

        console.log(ticketsNumber, winnersNumber, tickets);

        const winnersList: PublicKey[] = [];

        for (let i = 0; i < winnersNumber; i++) {
            const rand = Math.floor(Math.random() * ticketsNumber)
            // @ts-ignore: Anchor-generated account type is mismatched, ticketOwner exists on-chain
            const eachPubKey = tickets[rand].account.ticketOwner;
            winnersList.push(eachPubKey)
        }
        console.log(winnersList)
        // @ts-ignore: Anchor-generated account type is mismatched, ticketPrice exists on-chain
        const eachPrice = Math.floor((ticketsNumber * lottery.ticketPrice.toNumber()) / winnersNumber)

        // @ts-ignore: Anchor-generated account type is mismatched, vaultPda exists on-chain
        const vaultAddress = new PublicKey(lottery.vaultPda);



        try {
            // @ts-ignore: Anchor-generated account type is mismatched, name exists on-chain
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
                .drawWinners(lotteryName, lotteryPDA, vaultAddress, new BN(eachPrice), winnersList)
                .accounts({
                    lotteryAccount: lotteryPDA,
                    winnerAccount: winnerPDA,
                    signer: wallet?.publicKey,
                    systemProgram: SystemProgram.programId

                })
                .rpc()


            toast.success(`Winners drawn successfully. ${winnerPDA}`)
            getSingleLottery()

            console.log("Winners are drawn")

        } catch (error) {
            console.log("error while drawing winners", error)

        }

    }


    const getWinnersList = async () => {

        if (!wallet?.publicKey) {
            console.log("Wallet not connected");
            return
        };

        if (!lottery) {
            console.log("Lottery Not found");
            return;
        }

        const winnersList = await program.account.winner.all([
            {
                memcmp: {
                    offset: 8,

                    //@ts-ignore :Anchor-generated account type is mismatched, lotteryPda exists on-chain
                    bytes: lottery.lotteryPda.toBase58()
                }
            }

        ])
        setTickets(null)
        setLotteryWinnerList(winnersList as Winner[])
        console.log('this are the winnersList', winnersList);

    }
    if (!lottery) {
        return <p>Loading</p>
    }

    // console.log(lottery.name)
    return (

        <>
            <section className="max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4  flex flex-col  gap-x-8 gap-y-8">
                <Link href={"/"} className=" border border-neutral-500  rounded-md p-2 w-fit flex items-center b-6 " ><ArrowLeft /> Back</Link>


                <div>
                    <p className="text-4xl ">Dashboard  </p>

                    {lottery &&

                        <section className="flex items-start justify-between " >


                            <div>
                                <DashLotteryCard data={lottery} />
                            </div>

                            {tickets && lottery && (
                                <div className="max-w-xl p-6 bg-gradient-to-br from-purple-800/70 to-gray-900/20 backdrop-blur-md shadow-2xl rounded-xl hover:shadow-gray-900/50 transition-shadow duration-300 my-6 space-y-4">



                                    <p>
                                        <span className="font-medium text-gray-100">🔐 Vault Address:</span>{" "}

                                        <code className="text-neutral-400">{

                                            //@ts-ignore :Anchor-generated account type is mismatched, lotteryPda exists on-chain
                                            lottery.vaultPda.toBase58()
                                        }

                                        </code>
                                    </p>

                                    <section className="flex space-center gap-6 w-full ">
                                        <div className="p-2 border border-neutral-600/20 rounded-xl text-center bg-neutral-400/10" >
                                            <p className="text-base font-semibold text-neutral-400">Tickets Sold</p>
                                            <span className="text-2xl font-semibold text-neutral-400"   >{tickets?.length}</span>
                                        </div>

                                        <div className="p-2 border border-neutral-600/20 rounded-xl text-center bg-neutral-400/10">
                                            <p className="text-base font-semibold text-neutral-400">Vault Balance</p>
                                            <span className="text-2xl font-semibold text-neutral-400" >$ {

                                                //@ts-ignore :Anchor-generated account type is mismatched, ticketPrice exists on-chain
                                                (tickets?.length) * (lottery.ticketPrice.toNumber())} <span className="text-base" >SOL</span></span>
                                        </div>

                                    </section>


                                </div>
                            )}


                        </section>
                    }
                </div>



                <div className="flex justify-around w-full ">
                    <button onClick={fetchAllTickets} className="border border-neutral-200/40 text-white px-2 py-1 rounded-md hover:shadow-purple-500/20 cursor-pointer hover:scale-105 transition  duration-300"> All Tickets</button>
                    {
                        //@ts-ignore :Anchor-generated account type is mismatched, isDrawn exists on-chain
                        lottery.isDrawn && (
                            <button onClick={getWinnersList} className="bg-lime-600 text-white px-2 py-1 rounded-md hover:shadow-purple-500/20 cursor-pointer hover:scale-105">Lottery Winners</button>
                        )}

                    {

                        //@ts-ignore :Anchor-generated account type is mismatched, isDrawn exists on-chain
                        !lottery.isDrawn && (
                            <button onClick={drawWinners} className="bg-green-800 text-white rounded-md px-2 py-2 hover:shadow-purple-500/20 cursor-pointer hover:scale-105">Draw Winners</button>
                        )}
                </div>


                {lotteryWinnerList && (
                    <div>
                        {lotteryWinnerList.map((data: Winner, index: number) => {
                            return (
                                <div key={index} className="bg-gradient-to-r from-neutral-800/40  to-purple-500/40 rounded-xl p-6 shadow-xl border border-yellow-300/40 max-w-5xl mx-auto mb-4">
                                    <section className="text-center mb-6">
                                        <div className="flex justify-center items-center gap-2 text-yellow-500">

                                            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                                                Congratulations Winners 🎉
                                            </h1>

                                        </div>
                                        <p className="mt-2 text-lg text-white/90 font-medium">
                                            Prize: <span className=" font-bold text-xl">{data.account.amount.toNumber()} SOL </span>
                                        </p>
                                    </section>

                                    <div className="grid gap-4">
                                        {data.account.winners.map((winnerPubkey: PublicKey, index: number) => {
                                            return (
                                                <div key={index} className="flex items-center gap-8 bg-neutral-500/20 px-8 py-2 rounded-xl shadow-lg hover:scale-[1.02] transition transform duration-300 ">
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

                                        {tickets.map((ticket: Ticket, index: number) => (
                                            <tr key={index} className="hover:bg-gray-700/50 transition-all duration-300 hover:translate-x-1 group">
                                                <td className="px-6 py-4 text-gray-300 font-mono text-sm border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                    {
                                                        //@ts-ignore :Anchor-generated account type is mismatched, ticketId exists on-chain
                                                        ticket.account.ticketId.toNumber()}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300 font-mono text-sm border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                    {/* {ticket.account.ticketId}  */}
                                                    ticketAddress
                                                </td>
                                                <td className="px-6 py-4 text-gray-300 border-r border-gray-700/50 last:border-r-0 group-hover:text-gray-100">
                                                    {
                                                        //@ts-ignore :Anchor-generated account type is mismatched, ticketOwner exists on-chain
                                                        ticket.account.ticketOwner.toBase58()}
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

export default Dashboard;