"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from ".././public/logo.svg"
import Image from "next/image";

function nav() {
    const router = useRouter()
    return (
        <>
            <header className="max-w-7xl mx-auto flex justify-between py-4">
                <div
                    onClick={() => {
                        router.push('/')
                    }}

                    className=" flex items-end gap-x-2 pb-2 cursor-pointer" >

                    <div>
                        <div
                            className="bg-gradient-to-t from-[#9945FF] via-[#19FB9B] to-[#00FFA3] size-10 rounded-full ">
                        </div>
                    </div>

                    <Image className=" " src={logo} alt="Logo" width={100} height={100} />


                </div>

                <div className="flex items-center gap-x-4">
                    <Link href={"/create"} className="bg-transparent border border-zinc-400/40  text-base font-bold hover:bg-zinc-800/20 cursor-pointer rounded-md p-2 , text-transparent bg-clip-text bg-gradient-to-br from-[#9945FF] via-[#19FB9B] to-[#00FFA3]" >Create Lottery</Link>

                    <WalletMultiButton />
                </div>
            </header>

        </>
    )
}


export default nav;