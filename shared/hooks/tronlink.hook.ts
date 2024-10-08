import { useState, useEffect, useCallback, useMemo } from 'react';
import { TronAddress } from '../store';

export type Wallets = 'tronlink' | 'safepal';

export const useTronlink = () => {
    const [tlProvider, setTlProvider] = useState<any | undefined>(undefined);
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

        setTlProvider((window as any).tronLink);
        return (window as any).tronLink;
    }, [tlProvider]);


    // Автоматическая проверка подключения при загрузке
    useEffect(() => {
        setTlProvider(tronLinkProvider)
        if(!tlProvider) {
            return;
        }
        if(!tlProvider.ready) {
            return;
        }


        if (tlProvider.ready && tlProvider.defaultAddress !== undefined) {
            setState({
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: tlProvider.defaultAddress as TronAddress,
            });
        }
    }, [tronLinkProvider]);


    const connect = useCallback(async () => {
        if(tlProvider === undefined) {
            throw new Error('TronLink extension has not been installed!');
        }

        try {
            setState(prevState => ({
                ...prevState,
                isConnecting: true,
            }));
            
            await tlProvider.request({ method: 'tron_requestAccounts' });
            
            setState(prevState => ({
                ...prevState,
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: tlProvider.tronWeb.defaultAddress as TronAddress,
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
        tlProvider,
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
        tlProvider,
    ]);

    return { ...state, connect, disconnect };
};
