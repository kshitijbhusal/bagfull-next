  const createLottery = async () => {
    if (!wallet?.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {

      const lotteryName = "Dami"
      const [lotteryPDA, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("lottery"), Buffer.from(lotteryName)],
        PROGRAM_ID
      );

      console.log('lotteryPDA is', lotteryPDA.toBase58());


      const tx = await program.methods
        .createLottery(lotteryName, new BN(4), lotteryPDA)
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