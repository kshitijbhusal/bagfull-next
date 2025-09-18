"use client"
import { useProgram } from "@/lib/useProgram";
import { BN } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

import PROGRAM_ID from "@/lib/constants";
import toast from "react-hot-toast";

const lotteryCard = ({
  title,
  price,
  lotteryPDA,
  createdBy,
  id,
  vault
}: {
  title: string,
  price: number,
  lotteryPDA: string,
  createdBy: string,
  id:Number,
  vault:string
}) => {

  const program = useProgram()
  console.log('createdBy', createdBy)
  const router = useRouter()
  const wallet = useAnchorWallet()



  const purchaseTicket = async (lottery_pda: string) => {

    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      console.log('hhhhhhhhhhhhhhhhhhhh', lottery_pda);

      const lotteryPda = new PublicKey(lottery_pda)
      console.log('passed lottery pda is ', lotteryPda.toBase58());


      const [ticketPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket"), wallet.publicKey.toBuffer(), lotteryPda.toBuffer()],
        PROGRAM_ID
      );

      console.log('ticketPDA is ', ticketPDA.toBase58());

      const lotteryName = title;


      const tx = await program.methods
        .purchaseTicket(lotteryName, new BN(id), new BN(price), lotteryPda)
        .accounts({
          lotteryAccount: lotteryPda,
          ticketAccount: ticketPDA,
          signer: wallet?.publicKey,
          systemProgram: SystemProgram.programId

        }).rpc()

      

      toast.success("Ticket purchased seccessfully!")

    } catch (error) {
      console.log('Error while purchase ticket', error);
      toast.error("Error: purchasing ticket!")

    }

  }

  return (
    <div className="w-full max-w-4xl p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
      <div className="flex gap-6 items-start">
        {/* Left image */}
        <div className="w-48 h-36 rounded-md overflow-hidden border-2 border-green-200/40 bg-green-50/50 flex-shrink-0 flex items-center justify-center  ">
          
          <Image src={`https://picsum.photos/id/${id}/200`} width={200} height={200} alt="Lottery Image" className="opacity-80" />
        </div>

        {/* Middle content */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 leading-tight">{title} </h2>

          <div className="mt-3 text-sm text-white/70 space-y-1">
          
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Created by</span>
              <code className="bg-white/5 px-2 py-0.5 rounded text-xs font-medium">{createdBy} </code>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Vault</span>
              <code className="bg-white/5 px-2 py-0.5 rounded text-xs">{vault}</code>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-6">
            <div className="text-sm text-white/80">
              <div className="text-base">Ends in <span className="font-xl">24 hour</span></div>
            </div>

            <div className="ml-auto text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">$ {price} <span className="text-lg font-normal">SOL</span></div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="px-4 py-2 rounded-xl border border-white/12 bg-white/3 backdrop-blur-sm text-sm font-medium text-white/85 hover:scale-[1.02] transition-transform">Rules and Policy</button>

            <button onClick={() => {
              router.push(`/dashboard/${lotteryPDA}`)
            }} className="px-6 py-2 rounded-xl border border-white/12 bg-white/3 backdrop-blur-sm text-sm font-medium text-white/85 hover:scale-[1.02] transition-transform">Dashboard</button>

            <div className="ml-auto">
              <button onClick={() => {
                purchaseTicket(lotteryPDA)
              }} className="px-5 py-2 rounded-xl bg-gradient-to-br from-green-400/20 to-green-300/10 border border-green-300/30 text-green-50 font-semibold shadow-md hover:translate-y-[-2px] transition-all">
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* subtle bottom divider */}
      <div className="mt-6 border-t border-white/6 pt-4 text-xs text-white/40">
        <span>Lottery ID • Solana Network • <code className="bg-white/5 px-2 py-0.5 rounded text-xs font-medium">{lotteryPDA}</code> </span>
      </div>
    </div>

  )

}


export default lotteryCard;