import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ALCHEMY_PROVIDER_KEY, WALLET_CONNECT_PROJECT_ID } from "@/shared/config";
import { walletConnect, safe, metaMask } from 'wagmi/connectors';


const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [mainnet],
        transports: {
            // RPC URL for each chain
            [mainnet.id]: http(
                `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_PROVIDER_KEY}`,
            ),
        },
        connectors: [
            walletConnect({
                projectId: WALLET_CONNECT_PROJECT_ID,
            }),
            safe(),
            metaMask(),
        ],

        // Required API Keys
        walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,

        // Required App Info
        appName: "Tron Connect Web",

        // Optional App Info
        appDescription: "Your App Description",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};