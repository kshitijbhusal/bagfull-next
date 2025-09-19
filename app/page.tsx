"use client"
import LotteryCard from '@/components/LotteryCard'
import { useProgram } from '@/lib/useProgram'
import type { Lottery } from '@/types/types';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Wallet2 } from 'lucide-react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'




const Home: NextPage = () => {
  const program = useProgram();
  

  const [lotteries, setLotteries] = useState<Lottery[] | null>(null);

  useEffect(() => {
    fetchLottery()
  }, [])

  const fetchLottery = async () => {

    const lotteryData = await program.account.lottery.all();

    setLotteries(lotteryData as Lottery[])
    console.log('Lottery is', lotteryData);


  }


  return (
    <>
      <div className='w-screen h-screen absolute z-[-10]   '></div>

      <div className=' md:max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4 '>

        <div className=' flex  flex-col items-center justify-center m-12 gap-y-4'>
          <div className=" w-fit p-2 text-xs rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(0,255,128,0.7)] transition-all duration-300">
            Blockchain for your Luck
          </div>

          <h1 className='text-7xl w-fit    font-bold  text-center , text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] via-[#19FB9B] to-[#00FFA3] '>SOLANA LOTTERY SHOP</h1>
        </div>




        {
          lotteries && lotteries.map((lottery: Lottery, index: number) => (
            <div key={index} className='bg--500 flex flex-col  items-center justify-centre p-4 space-y-4'>

              <LotteryCard

                title={
                  //@ts-expect-error : idk this
                  lottery.account.name}
                price={
                  //@ts-expect-error : idk
                  lottery.account.ticketPrice.toNumber()}
                lotteryPDA={
                  //@ts-expect-error : idk
                  lottery.account.lotteryPda.toBase58()}
                createdBy={
                  //@ts-expect-error : idk
                  lottery.account.createdBy.toBase58()}
                id={index + 151}
                vault={
                  //@ts-expect-error : idk
                  lottery.account.vaultPda.toBase58()}
                isDrawn={
                  //@ts-expect-error : idk
                  lottery.account.isDrawn}

              />


            </div>

          ))
        }
      </div>
    </>
  )

}
export default Home;