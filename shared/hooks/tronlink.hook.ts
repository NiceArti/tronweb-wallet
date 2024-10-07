import { useState, useEffect, useCallback, useMemo } from 'react';
import { TronAddress } from '../store';

export type Wallets = 'tronlink' | 'safepal';

export const useTronlink = () => {
    const [state, setState] = useState<{
        isConnected?: boolean,
        isConnecting?: boolean,
        isDisconnected?: boolean,
        address?: TronAddress,
    }>({
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        address: undefined
    });


    const tronLinkProvider = useMemo(() => {
        if(typeof window === 'undefined') {
            return undefined;
        }

        return (window as any).tronLink;
    }, []);


    // Автоматическая проверка подключения при загрузке
    useEffect(() => {
        if(!tronLinkProvider) {
            return;
        }
        if(!tronLinkProvider.ready) {
            return;
        }


        if (tronLinkProvider.ready && tronLinkProvider.defaultAddress !== undefined) {
            setState({
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: tronLinkProvider.defaultAddress as TronAddress,
            });
        }
    }, []);


    const connect = useCallback(async () => {
        if(tronLinkProvider === undefined) {
            throw new Error('TronLink extension has not been installed!');
        }

        try {
            setState(prevState => ({
                ...prevState,
                isConnecting: true,
            }));
            
            await tronLinkProvider.request({ method: 'tron_requestAccounts' });
            
            setState(prevState => ({
                ...prevState,
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: tronLinkProvider.tronWeb.defaultAddress as TronAddress,
            }));
        } catch(e) {
            setState(prevState => ({
                ...prevState,
                isConnected: false,
                isConnecting: false,
                isDisconnected: true,
                address: undefined,
            }));
            console.error(e);
        }
    }, [
        state,
        tronLinkProvider,
    ]);



    const disconnect = useCallback(() => {
        setState({
            isConnected: false,
            isConnecting: false,
            isDisconnected: true,
            address: undefined
        });

    }, [
        state,
        tronLinkProvider,
    ]);

    return { ...state, connect, disconnect };
};
