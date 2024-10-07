'use client'

import { useCallback, useEffect, useState } from 'react';
import { useTronWalletConnect } from './connect-tron.hook';
import { useSafePalConnect } from './connect-sfp.hook';
import { useWalletConnect } from './connect-wallet.hook';
import { NetworkConnection, useConnectionStore } from '../store';

export interface TronAddress {
    base58: string,
    hex: string,
    name: string
    type: number,
}


export function useManyWalletConnect() {
    const [state, setState] = useState<{
        isConnected: boolean;
        isConnecting: boolean;
        isDisconnected: boolean;
        error: string | undefined;
        address: string | TronAddress | undefined;
    }>({
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        error: undefined,
        address: undefined,
    });
    const {
        isConnected: isWtcConnected,
        isDisconnected: isWtcDisconnected,
        network: wtcNetwork,
        address: wtcAddress,
        setState: setWtcState,
    } = useConnectionStore();


    const {
        connect: connectTronLink,
        disconnect: disconnectTronlink,
        address: tronAddress,
        isConnecting: isTronConnecting,
        isConnected: isTronConnected,
        isDisconnected: isTronDisconnected,
    } = useTronWalletConnect();
    const {
        connect: connectSafepal,
        disconnect: disconnectSafepal,
        address: addressSafepal,
        isConnecting: isSafepalConnecting,
        isConnected: isSafepalConnected,
        isDisconnected: isSafepalDisconnected,
    } = useSafePalConnect();
    const {
        connect: connectWallet,
        disconnect: disconnectWallet,
        address,
        isConnecting,
        isConnected,
        isDisconnected,
    } = useWalletConnect();


    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            isConnected: isWtcConnected,
            isDisconnected: isWtcDisconnected,
            address: typeof wtcAddress === 'string' ? wtcAddress : wtcAddress?.base58,
        }));
    }, [wtcNetwork, isWtcConnected, isWtcDisconnected]);


    const connect = useCallback(async (connectorId: string) => {
        if(state.isConnecting || state.isConnected) {
            return;
        }
        

        setState(prevState => ({ ...prevState, isConnecting: true }));

        try {
            let connectionAddress: undefined | string | TronAddress = undefined;
            let network: undefined | NetworkConnection = undefined;

            switch (connectorId) {
                case 'tron':
                    await connectTronLink();
                    connectionAddress = tronAddress?.base58;
                    network = 'tron';
                    break;
                case 'safepal':
                    await connectSafepal();
                    connectionAddress = addressSafepal;
                    network = 'ethereum';
                    break;
                default:
                    await connectWallet(connectorId);
                    connectionAddress = address
                    network = 'ethereum'
                    break;
            }

            setWtcState({
                isConnected: true,
                isDisconnected: false,
                network: network,
                address: connectionAddress,
            });

            setState(prevState => ({
                ...prevState,
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                address: connectionAddress,
            }));
        } catch(e: any) {
            setWtcState({
                isConnected: false,
                isDisconnected: true,
                network: undefined,
                address: undefined,
            });

            setState(prevState => ({
                ...prevState,
                isConnected: false,
                isConnecting: false,
                isDisconnected: true,
                address: undefined,
                error: e.toString(),
            }));
        }
        
    }, [
        connectSafepal,
        connectTronLink,
        connectWallet,
        state,
        wtcNetwork,
        isWtcConnected,
        isWtcDisconnected,
    ]);


    const disconnect = useCallback(() => {
        if (isTronConnected) {
            disconnectTronlink();
        }
        if (isSafepalConnected) {
            disconnectSafepal();
        }
        if (isConnected) {
            disconnectWallet();
        }
        setState({
            isConnected: false,
            isConnecting: false,
            isDisconnected: true,
            error: undefined,
            address: undefined,
        });

        setWtcState({
            isConnected: false,
            isDisconnected: true,
            network: undefined,
            address: undefined,
        });
    }, [
        disconnectSafepal,
        disconnectTronlink,
        disconnectWallet,
        state,
        wtcNetwork,
        isWtcConnected,
        isWtcDisconnected,
    ]);


    return {
        connect,
        disconnect,
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        isDisconnected: state.isDisconnected,
        address: state.address,
        error: state.error,
        network: wtcNetwork,
    };
}
