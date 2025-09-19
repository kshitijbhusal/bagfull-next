'use client '

import { ReactNode, FC } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

interface AppProps {
  children: ReactNode;
}

const App: FC<AppProps> = ({ children }) => {
    const wallets = [new PhantomWalletAdapter()];
    return (
        <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;