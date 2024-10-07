import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface TronAddress {
    base58: string,
    hex: string,
    name: string
    type: number,
}

export type NetworkConnection = 'ethereum' | 'tron';
export type ConnectionType = 'tronlink' | 'safepal' | 'metamask' | 'trustwallet' | 'walletconnect';

interface Store {
    isConnected: boolean;
    isDisconnected: boolean;
    network?: NetworkConnection;
    connectionId?: ConnectionType,
    address?: string | TronAddress;
}

interface Action {
    setState: (state: Store) => void;
}

export const useConnectionStore = create<Store & Action>()(
    devtools(
        persist((set, get) => ({
            isConnected: false,
            isDisconnected: true,
            network: undefined,
            address: undefined,
            connectionId: undefined,
            setState: (value: Store) => set(() => (value)),
        }),
        {name: 'wtc-connection-store'},
    ),
));