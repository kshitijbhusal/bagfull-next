import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import flow from "../../public/img/flow.png"

function policy() {
    return (
        <>
            <section className="max-w-7xl h-fit mx-auto bg-blue-600/5 p-10 font-mono rounded-2xl shadow-lg ">
                <h1 className="text-4xl font-bold text-center mb-10">Rules and Policy</h1>

                {/* Intro */}
                <div className="mb-10">
                    {/* <h2 className="text-2xl font-semibold mb-2">Introduction</h2> */}
                    <p className="text-lg leading-relaxed">
                        Welcome to our lottery platform! We aim to provide a fair, transparent,
                        and enjoyable experience for every participant. Please review the
                        following rules and policies carefully before joining. By participating,
                        you agree to follow these guidelines.
                    </p>
                </div>

                {/* Rules */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Rules</h2>
                    <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
                        <li>Each participant can purchase one or more tickets.</li>
                        <li>Tickets are non-refundable once purchased.</li>
                        <li>The lottery will close after the specified end time or when all tickets are sold.</li>
                        <li>Winners are selected randomly to ensure fairness and transparency.</li>
                        <li>Payouts are distributed directly to the winners’ connected wallets.</li>
                    </ul>
                </div>

                {/* Policy */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Policy</h2>
                    <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
                        <li>All results are final once announced.</li>
                        <li>The platform reserves the right to disqualify suspicious activities or cheating attempts.</li>
                        <li>If technical issues occur, the lottery may be paused or rescheduled to maintain fairness.</li>
                        <li>User funds are securely handled within the vault system until distribution.</li>
                    </ul>
                </div>

                {/* Logic & Math */}
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Logic & Math</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Our lottery follows a simple and transparent formula:
                    </p>
                    <ul className="list-disc pl-6 text-lg leading-relaxed space-y-2">
                        <li><strong>25%</strong> of the total participants will be declared as winners.</li>
                        <li>The <strong>vault balance</strong> (total collected SOL) will be divided equally among all winners.</li>
                        <li>Each winner receives: <code>Vault Balance ÷ Number of Winners</code></li>
                    </ul>
                    <div className="m-2">

                        <Image src={flow} alt="Flow Image" />
                    </div>

                    <div className="flex text-xl text-neutral-400 justify-end my-8  items center">

                        <Link className="flex items-center gap-2" target="_blank" href={"https://x.com/steezcodes"}> Find me on X <LinkIcon /> </Link>
                    </div>
                </div>
            </section>

        </>
    )
}



export default policy;