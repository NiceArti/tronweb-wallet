import { useCallback, useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

export function useWalletConnect() {
    const {
        connect,
        connectors,
        error,
        isError,
        isIdle,
        isPaused,
        isPending,
    } = useConnect();

    const {
        address,
        isConnected,
    } = useAccount();

    const {
        disconnect,
    } = useDisconnect();


    const connectWallet = useCallback(async (connectorId: string) => {
        const connector = connectors.find(c => c.id === connectorId);
        if (connector) {
            try {
                await connect({ connector });
            } catch (err) {
                console.error("Error connecting wallet:", err);
            }
        } else {
            console.error("Connector not found:", connectorId);
        }
    }, [connect, connectors]); // Зависимости: connect и connectors


    const disconnectWallet = useCallback(async () => {
        try {
            await disconnect();
        } catch (err) {
            console.error("Error disconnecting wallet:", err);
        }
    }, [disconnect]); // Зависимость: disconnect


    return {
        connect: connectWallet,
        disconnect: disconnectWallet,
        address,
        isConnected,
        isDisconnected: !isConnected,
        isError,
        isIdle,
        isPaused,
        isConnecting: isPending,
        error,
    };
}
