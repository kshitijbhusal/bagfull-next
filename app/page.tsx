"use client"
import LotteryCard from '@/components/LotteryCard'
import { useProgram } from '@/lib/useProgram'
import type { Lottery } from '@/types/types';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'




export const Home:NextPage = () => {
  const program = useProgram();
  const wallet = useAnchorWallet();

  const [lotteries, setLotteries] = useState<Lottery[] | null >(null);

  useEffect(()=>{
    fetchLottery()
  },[])

  const fetchLottery = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    const lotteryData = await program.account.lottery.all();

    setLotteries(lotteryData as Lottery[])
    console.log('Lottery is', lotteryData);


  }


  return (
    <>
      <div className='w-screen h-screen absolute z-[-10]   '></div>

      <div className='max-w-7xl h-screen mx-auto bg-purpe-600/20  p-4 '>

        

        <div className=' flex justify-center m-12'>
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
                id={index + 200}
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