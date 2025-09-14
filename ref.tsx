import { useAnchorWallet, useConnection, } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";


import { useProgram } from "../hooks/useProgram"
import { BN } from "@project-serum/anchor";
import { useState } from "react";
import { createLogger } from "vite";




export default function MyComponent() {

  const [alllottery, setAllLottery] = useState<any>([]);
  const [myTickets, setMyTickets] = useState<any>([])


  const wallet = useAnchorWallet()
  const PROGRAM_ID = new PublicKey("Awn86VJSY4PW48dpGeDtXNsbiQZqcrfNgamobE6ER8sJ");



  const program = useProgram()
  console.log('program from hook is ', program);

  const createTodo = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const [lotteryPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("lottery"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      console.log('lotteryPDA is', lotteryPDA.toBase58());


      const tx = await program.methods
        .createLottery("Gen Z Protest", new BN(100), lotteryPDA)
        .accounts({
          lotteryAccount: lotteryPDA,
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId
        })
        .rpc();

      console.log("Transaction successful:", tx);
    } catch (error) {
      console.error("Failed to create Todo:", error);
    }
  };




  const purchaseTicket = async (lottery_pda: string) => {

    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const lotteryPDA = new PublicKey(lottery_pda)
      console.log('passed lottery pda is ', lotteryPDA.toBase58());


      const [ticketPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("ticket"), wallet.publicKey.toBuffer(), lotteryPDA.toBuffer()],
        PROGRAM_ID
      );

      console.log('ticketPDA is ', ticketPDA.toBase58());


      const tx = await program.methods
        .purchaseTicket(new BN(8), new BN(20))
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


  const fetchLottery = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    // const [lotteryPDA, bump] = PublicKey.findProgramAddressSync(
    //   [Buffer.from("lottery"), wallet.publicKey.toBuffer()],
    //   PROGRAM_ID
    // );

    // console.log('lottery pda is ', lotteryPDA.toBase58());



    // const lotteryData = await program.account.lottery.fetch(lotteryPDA)
    const lotteryData = await program.account.lottery.all();

    setAllLottery(lotteryData)
    console.log('Lottery is', lotteryData);

  }

  const fetchMyTickets = async () => {
    if (!wallet?.publicKey) {
      console.log("Wallet not connected");
      return
    }

    // console.log(wallet.publicKey.toBase58());
    

    const ticketAccounts = await program.account.ticket.all();

    console.log(ticketAccounts);
    setMyTickets(ticketAccounts)

  }
  


  return <div>
    hello world
    <button onClick={createTodo} >Create todo</button>
    <button onClick={fetchLottery}>Fetch</button>

    <button onClick={() => {
      purchaseTicket("CMqo2PW64NjJMwT7XcWzqbAKeT3NMqiQj4i1hcpb4GQ4")
    }}>Buy Ticket</button>

    <button onClick={() => {
      fetchMyTickets()
    }}>My tickets</button>
    <WalletMultiButton />


    {true && (

      alllottery.map((lottery: any, index: number) => (

        <div key={index} style={{ backgroundColor: "pink" }}>
          <h1>Lottery Name {lottery.account.name} </h1>
          <p>Ticket Price {lottery.account.ticketPrice.toNumber()} </p>
          <p>Lottery Address {lottery.account.lotteryPda?.toBase58()} </p>
          <button onClick={() => {
            purchaseTicket(lottery.account.lotteryPda?.toBase58())
          }}  >Buy Tickets</button>
        </div>

      ))


    )}

    <div style={{
      backgroundColor: 'lightyellow',
      padding: "10px",
      width: "fit"
    }}>
      <p>Lottery pda {myTickets[0]?.account.lotteryAccount?.toBase58()} </p>
      <h1>tciket id {myTickets[0]?.account.ticketId.toNumber()} </h1>
      <h1>tciket owner {myTickets[0]?.account.ticketOwner.toBase58()} </h1>
      <h1>tciket price {myTickets[0]?.account.ticketPrice.toNumber()} </h1>
      <p>status: verified </p>

    </div>
  </div>;
}
