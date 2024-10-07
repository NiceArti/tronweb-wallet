import { useState, useEffect, useCallback } from 'react';

interface SafePalConnectState {
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    error?: string;
    address?: string;
}

export const useSafePalConnect = () => {
    const [state, setState] = useState<SafePalConnectState>({
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        error: undefined,
        address: undefined
    });

    // Автоматическая проверка подключения при загрузке
    useEffect(() => {
        if (window.ethereum && window.ethereum.isSafePal && window.ethereum.selectedAddress) {
            setState({
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                error: undefined,
                address: window.ethereum.selectedAddress
            });
        }
    }, []);

    // Функция для подключения к SafePal
    const connect = useCallback(async () => {
        const safePalTron = typeof window !== 'undefined' && (window as any).safepalTronProvider;
        
        if(safePalTron === undefined) {
            throw Error('Safepal wallet extension has not been installed!');
        }

        try {
            await safePalTron.connectWallet();
        } catch(e) {
            console.error(e);
        }
        
        // if (window.ethereum && window.ethereum.isSafePal) {
        //     try {
        //         setState(prevState => ({
        //             ...prevState,
        //             isConnecting: true,
        //             isDisconnected: false,
        //             error: undefined
        //         }));

        //         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //         if (accounts.length > 0) {
        //             setState({
        //                 isConnected: true,
        //                 isConnecting: false,
        //                 isDisconnected: false,
        //                 error: undefined,
        //                 address: accounts[0]
        //             });
        //         } else {
        //             setState({
        //                 isConnected: false,
        //                 isConnecting: false,
        //                 isDisconnected: true,
        //                 error: 'No accounts found'
        //             });
        //         }
        //     } catch (error: any) {
        //         setState({
        //             isConnected: false,
        //             isConnecting: false,
        //             isDisconnected: true,
        //             error: error.message || 'Failed to connect'
        //         });
        //     }
        // } else {
        //     setState({
        //         isConnected: false,
        //         isConnecting: false,
        //         isDisconnected: true,
        //         error: 'SafePal is not available'
        //     });
        // }
    }, [state]);

    // Функция для отключения SafePal
    const disconnect = useCallback(() => {
        setState({
            isConnected: false,
            isConnecting: false,
            isDisconnected: true,
            error: undefined,
            address: undefined
        });


        // Пытаемся закрыть сессию WalletConnect, если используется
        if (window.ethereum && window.ethereum.isSafePal) {
            window.ethereum.disconnect && window.ethereum.disconnect();
        }
    }, [state]);

    return { ...state, connect, disconnect };
};
