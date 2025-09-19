"use client"
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";


 type dataType =  {
        name: string,
        ticketPrice: BN,
        lotteryPda: PublicKey,
        createdBy: PublicKey,
        isOpen: boolean,
        isDrawn: boolean,
        isPayoutDone: boolean,
 }


const DashLotteryCard = ({ data }:{data:dataType}) => {

    if (!data.name) {
        return (
            <div className="max-w-xl mx-auto" >
                <p className="text-center">Loading...</p>
            </div>
        )
    }

    return (
        <>
            <section>
                <div className="max-w-xl p-6 bg-gradient-to-br from-gray-900/25 to-purple-800/70 backdrop-blur-md shadow-2xl rounded-xl hover:shadow-gray-900/50 transition-shadow duration-300 my-6">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-500 tracking-wide">
                        {data.name}
                    </h2>

                    <div className="text-sm text-gray-300 mb-6 space-y-2">
                        <p>
                            <span className="font-medium text-gray-100">🎟 Ticket Price:</span>{" "}
                            ${data.ticketPrice.toNumber()} SOL
                        </p>
                        <p className="truncate">
                            <span className="font-medium text-gray-100">🎲 Lottery PDA:</span>{" "}
                            <span className="text-gray-400">{data.lotteryPda.toBase58()}</span>
                        </p>
                        <p className="truncate">
                            <span className="font-medium text-gray-100">👤 Created By:</span>{" "}
                            <span className="text-gray-400">{data.createdBy.toBase58()}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div
                            className={`p-2 rounded-xl font-semibold shadow-inner ${data.isOpen
                                ? "bg-green-500/20 text-green-300 border border-green-600/40"
                                : "bg-red-500/20 text-red-300 border border-red-600/40"
                                }`}
                        >
                            Open <br /> {data.isOpen ? "✅" : "❌"}
                        </div>
                        
                        <div
                            className={`p-2 rounded-xl font-semibold shadow-inner ${data.isDrawn
                                ? "bg-green-500/20 text-green-300 border border-green-600/40"
                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-600/40"
                                }`}
                        >
                            Drawn <br /> {data.isDrawn ? "✅" : "⏳"}
                        </div>
                        <div
                            className={`p-2 rounded-xl font-semibold shadow-inner ${data.isPayoutDone
                                ? "bg-green-500/20 text-green-300 border border-green-600/40"
                                : "bg-blue-500/20 text-blue-300 border border-blue-600/40"
                                }`}
                        >
                            Payout <br /> {data.isPayoutDone ? "💸" : "⏳"}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default DashLotteryCard;