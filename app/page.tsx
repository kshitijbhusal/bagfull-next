"use client"
import LotteryCard from '@/components/LotteryCard'
import { useProgram } from '@/lib/useProgram'
import { BN } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import React, { useState } from 'react'



export const Page = () => {
  const program = useProgram();
  const wallet = useAnchorWallet()

  const [lotteries, setLotteries] = useState<any>([])
  const [allTickets, setAllTickets] = useState<any>([])

  const PROGRAM_ID = new PublicKey("Awn86VJSY4PW48dpGeDtXNsbiQZqcrfNgamobE6ER8sJ")

  // console.log(program)

  const fetchLottery = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    const lotteryData = await program.account.lottery.all();

    setLotteries(lotteryData)
    console.log('Lottery is', lotteryData);


  }



  const fetchAllTickets = async () => {
    if (!wallet?.publicKey) {
      console.log("Wallet not connected");
      return
    }

    // console.log(wallet.publicKey.toBase58());


    const ticketAccounts = await program.account.ticket.all();

    console.log(ticketAccounts);
    setAllTickets(ticketAccounts)

  }


  const purchaseTicket = async (lottery_pda: string) => {

    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {

      const lotteryName = "Dami"

      const [lotteryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("lottery"), Buffer.from(lotteryName)],
        PROGRAM_ID
      );
      // const lotteryPDA = new PublicKey(lottery_pda); --
      console.log('passed lottery pda is ', lotteryPDA.toBase58());

      console.log("lotteryName:", lotteryName)
      console.log("Derived PDA:", lotteryPDA.toBase58())

      const [ticketPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket"), wallet.publicKey.toBuffer(), lotteryPDA.toBuffer()],
        PROGRAM_ID
      );

      console.log('ticketPDA is ', ticketPDA.toBase58());




      const tx = await program.methods
        .purchaseTicket(lotteryName, new BN(8), new BN(20), lotteryPDA)
        .accounts({
          lotteryAccount: lotteryPDA,
          ticketAccount: ticketPDA,
          signer: wallet?.publicKey,
          systemProgram: SystemProgram.programId

        }).rpc()

      console.log('Ticket Purchased ', tx)

    } catch (error) {
      console.log('Error while purchase ticket', error);

    }
  }










  const drawWinners = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {

      console.log(allTickets.length)

      // console.log("Transaction successful:", tx);
    } catch (error) {
      console.error("Failed to create Todo:", error);
    }
  };




  return (
    <div className='max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4'>

      <div>
        <button className='' onClick={fetchLottery} >Fetch Lottery</button>
      </div>

      <div className=' flex justify-center m-12'>
        <h1 className='text-7xl w-fit   font-bold  text-center , text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] via-[#19FB9B] to-[#00FFA3] '>SOALNA LOTTERY SHOP</h1>
      </div>




      {
        lotteries.map((lottery: any, index: any) => (
          <div key={index} className='bg--500 flex flex-col  items-center justify-centre p-4 space-y-4'>
            <LotteryCard
              title={lottery.account.name}
              price={lottery.account.ticketPrice.toNumber()}
              lotteryPDA={lottery.account.lotteryPda.toBase58()}
            />

            {/* {JSON.stringify(lottery)} */}

          </div>

        ))
      }
    </div>
  )
}
export default Page;