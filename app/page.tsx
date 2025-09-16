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

  const PROGRAM_ID = new PublicKey("G9fnVkph8qGQUNmLhhvj5BpsZfwVSNvUHDKi2E1YSzn8")

  // console.log(program)

  const fetchLottery = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }
    
    console.log("ctrl reach here")
    const lotteryData = await program.account.lottery.all();
    console.log("ctrl bypass")

    setLotteries(lotteryData)
    console.log('Lottery is', lotteryData);


  }














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
          {JSON.stringify(lottery.account.createdBy.toBase58())}
            <LotteryCard
              title={lottery.account.name}
              price={lottery.account.ticketPrice.toNumber()}
              lotteryPDA={lottery.account.lotteryPda.toBase58()}
              createdBy={lottery.account.createdBy.toBase58()}
              
            />

            {/* {JSON.stringify(lottery)} */}

          </div>

        ))
      }
    </div>
  )
}
export default Page;