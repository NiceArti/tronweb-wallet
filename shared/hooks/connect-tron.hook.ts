'use client'

import { useCallback, useEffect, useState } from 'react';

export interface TronAddress {
    base58: string,
    hex: string,
    name: string
    type: number,
}


export function useTronWalletConnect() {
    const [state, setState] = useState<{
        isConnected: boolean;
        isConnecting: boolean;
        isDisconnected: boolean;
        error: undefined | string;
        address: undefined | TronAddress;
    }>({
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        error: undefined,
        address: undefined,
    });



    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).tronLink) {
            const tronWeb = (window as any).tronLink.tronWeb;
            
            if(tronWeb.defaultAddress !== undefined) {
                setState({
                    isConnected: true,
                    isConnecting: false,
                    isDisconnected: false,
                    error: undefined,
                    address: tronWeb.defaultAddress,
                });
            }
        }
    }, []);


    const connect = useCallback(async () => {
        if (typeof window !== 'undefined' && (window as any).tronLink) {
            try {
                const tronLink = (window as any).tronLink;
                
                if(!tronLink.ready) {
                    setState({
                        isConnected: false,
                        isConnecting: true,
                        isDisconnected: true,
                        error: undefined,
                        address: undefined,
                    });

                    console.log('Requesting TronLink activation...');
                    await tronLink.request({ method: 'tron_requestAccounts' });
                }
        
                const tronWeb = tronLink.tronWeb;
                if (tronWeb && tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
                    setState({
                        isConnected: true,
                        isConnecting: false,
                        isDisconnected: false,
                        error: undefined,
                        address: tronWeb.defaultAddress as TronAddress,
                    });

                    console.log('Successfully connected to TronLink with address:', tronWeb.defaultAddress.base58);
                } else {
                    throw new Error('Failed to retrieve TronLink account address');
                }
            } catch (error) {
                console.error('Error connecting to TronLink:', error);
                setState({
                    isConnected: false,
                    isConnecting: false,
                    isDisconnected: true,
                    error: `Error connecting to TronLink: ${error}`,
                    address: undefined,
                });
            }
        } else {
            console.error('TronLink extension not found');

            setState({
                isConnected: false,
                isConnecting: false,
                isDisconnected: true,
                error: 'TronLink extension not found',
                address: undefined,
            });
        }
    }, [state]);


    const disconnect = useCallback(() => {
        if (state.isConnected) {
            setState({
                isConnected: false,
                isConnecting: false,
                isDisconnected: true,
                error: undefined,
                address: undefined,
            });
            
            // Cleaning loacalstorage
            localStorage.removeItem('tronLinkConnected');
            localStorage.removeItem('tronAddress');

            console.info('Disconnecting TronLink... Also make sure to disconnect from your wallet');
        }
    }, [state]);


    return {
        connect,
        disconnect,
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        isDisconnected: state.isDisconnected,
        address: state.address,
        error: state.error,
    };
}
