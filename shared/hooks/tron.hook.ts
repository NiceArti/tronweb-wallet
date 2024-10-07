import { useState, useEffect, useCallback, useMemo } from 'react';
import { TronAddress, useConnectionStore } from '../store';

export type Wallets = 'tronlink' | 'safepal';

export const useTronConnect = () => {
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

    const {
        isConnected,
        isDisconnected,
        network,
        address,
        connectionId,
        setState: setStateStore,
    } = useConnectionStore();


    const safepalTronProvider = useMemo(() => {
        if(typeof window === 'undefined') {
            return undefined;
        }

        return (window as any).safepalTronProvider;
    }, []);


    const tronLinkProvider = useMemo(() => {
        if(typeof window === 'undefined') {
            return undefined;
        }

        return (window as any).tronLink;
    }, []);

    // Автоматическая проверка подключения при загрузке
    useEffect(() => {
        if(!connectionId) {
            return;
        }


        if (isConnected && address !== undefined) {
            setState({
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: address as TronAddress,
            });
        }
    }, [isConnected, address]);


    const connect = useCallback(async (walletId?: Wallets) => {
        if(!walletId || walletId === 'tronlink') {
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

                

                setStateStore({
                    network: 'tron',
                    isConnected: true,
                    isDisconnected: false,
                    connectionId: 'tronlink',
                    address: tronLinkProvider.defaultAddress as TronAddress,
                });
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

            return;
        } else if(walletId === 'safepal') {
            if(safepalTronProvider === undefined) {
                throw Error('Safepal extension has not been installed!');
            }

            try {
                setState(prevState => ({
                    ...prevState,
                    isConnecting: true,
                }));
                
                
                await safepalTronProvider.connectWallet();
                
                setState(prevState => ({
                    ...prevState,
                    isConnected: true,
                    isConnecting: false,
                    isDisconnected: false,
                    address: safepalTronProvider.defaultAddress as TronAddress,
                }));

                setStateStore({
                    network: 'tron',
                    isConnected: true,
                    isDisconnected: false,
                    connectionId: 'safepal',
                    address: safepalTronProvider.defaultAddress as TronAddress,
                });
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
        }
    }, [
        state,
        isConnected,
        isDisconnected,
        network,
        address,
        connectionId
    ]);



    const disconnect = useCallback(() => {
        setState({
            isConnected: false,
            isConnecting: false,
            isDisconnected: true,
            address: undefined
        });

        setStateStore({
            isConnected: false,
            isDisconnected: true,
            network: undefined,
            address: undefined,
            connectionId: undefined,
        });

    }, [
        state,
        isConnected,
        isDisconnected,
        network,
        address,
        connectionId,
    ]);

    return { ...state, connect, disconnect };
};
