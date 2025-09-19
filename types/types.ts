import { BN, ProgramAccount } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
type TicketAccount = {
  publicKey: PublicKey; // the account address
  account: {
    ticketId: BN;       // Anchor often returns numbers as strings
    ticketPrice: BN;    // same here (BN → string)
    lotteryPda: PublicKey;
    ticketOwner: PublicKey;
  };
};

type LotteryAccount = {
  publicKey: PublicKey; // account address
  account: {
    name: string;
    ticketPrice: BN;       // or string if you .toString() it
    lotteryPda: PublicKey;    // base58 pubkey
    createdBy: PublicKey;     // base58 pubkey
    vaultPda: PublicKey;      // base58 pubkey
    isOpen: boolean;
    isDrawn: boolean;
    isPayoutDone: boolean;
  };
};


type WinnerAccount = {
  lotteryPda: PublicKey;
  vaultPda: PublicKey;
  amount: BN;
  winners: PublicKey[];
};

export type Ticket = ProgramAccount<TicketAccount>;
export type Lottery = ProgramAccount<LotteryAccount>;
export type Winner = ProgramAccount<WinnerAccount>