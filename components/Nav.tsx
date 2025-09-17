"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

function nav() {
    const router = useRouter()
    return (
        <>
            <header className="max-w-7xl mx-auto  flex justify-between py-2">
                <div onClick={()=>{
                    router.push('/')
                }} className="bg-gradient-to-t from-[#9945FF] via-[#19FB9B] to-[#00FFA3] size-16 rounded-full cursor-pointer">

                </div>

                <div className="flex items-center gap-x-4">
                    <Link href={"/create"}  className="bg-transparent border border-zinc-400/40  text-base font-bold hover:bg-zinc-800/20 cursor-pointer rounded-md p-2 , text-transparent bg-clip-text bg-gradient-to-br from-[#9945FF] via-[#19FB9B] to-[#00FFA3]" >Create Lottery</Link>
                    
                    <WalletMultiButton/>
                </div>
            </header>

        </>
    )
}


export default nav;