import { useCallback, useMemo } from "react";
import { useApi } from "../api";
import { useTronConnect } from "./tron.hook";
import { DAPP_ADDRESS_HEX} from "../config";


export const useTronWeb = () => {
    const { post } = useApi();
    const { isConnected, address } = useTronConnect();

    const tronweb = useMemo(() => {
        if(typeof window === 'undefined') {
            return undefined;
        }

        return (window as any).tronWeb;
    }, []);


    const amountToHuman = useCallback((amount: string | number = 0): number => {
        if(amount == 0) {
            return 0;
        }

        return tronweb.fromSun(amount);
    }, [tronweb]);



    const balanceOf = useCallback(async (address: string, tokenAddress: string) => {
        try {
            const contract = await tronweb.contract().at(tokenAddress);
            return await contract.balanceOf(address).call();
        } catch (error) {
            console.error('Error getting USDT balance:', error);
        }
    }, [tronweb, isConnected, address]);




    const transfer = useCallback(async (from: string, to: string, amount: number) => {

        try {
            const contract = await tronweb.contract().at(DAPP_ADDRESS_HEX);
            const transaction = await contract.sendUSDT(to, await tronweb.toSun(amount));
            await transaction.send();
        } catch (error) {
            console.error('Error processing raw data:', error);
        }
    }, [tronweb, isConnected, address, post]); 



    return {
        transfer,
        balanceOf,
        amountToHuman,
    }
}