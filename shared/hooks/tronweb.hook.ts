import { useCallback, useMemo } from "react";
import { useApi } from "../api";
import { useTronConnect } from "./tron.hook";
import { DAPP_ADDRESS_HEX, USDT_ADDRESS_BASE58, USDT_ADDRESS_HEX } from "../config";

export const useTronWeb = () => {
    const { post } = useApi();
    const { isConnected, address } = useTronConnect();

    const tronweb = useMemo(() => {
        if(typeof window === 'undefined') {
            return undefined;
        }

        return (window as any).tronWeb;
    }, [window]);


    const amountToHuman = useCallback((amount: any) => 
        tronweb.fromSun(amount.toNumber())
    , [tronweb]);



    const balanceOf = useCallback(async (address: string, tokenAddress: string) => {
        try {
            const contract = await tronweb.contract().at(tokenAddress);
            return await contract.balanceOf(address).call();
        } catch (error) {
            console.error('Error getting USDT balance:', error);
        }
    }, [tronweb, isConnected, address]);




    const transfer = useCallback(async (from: string, to: string, amount: number) => {
        // if(!isConnected) {
        //     throw new Error('Connect wallet first');
        // }


        try {
            // if (!tronweb || !tronweb.ready) {
            //     throw new Error('TronLink is not available');
            // }

            // const res = await post('/tron/create-transaction', {
            //     from: 'TMZKwqtGe2HcBriRt5pVubxmYjZ2Y3j6Nm',
            //     to,
            //     amount,
            // });
    
            // Получение информации о транзакции
            // const rawTx = await tronweb.trx.parseTransaction(res);
            
            // console.log(res);
            // const signature = await tronweb.trx.sign(res);
            // const receipt = await tronweb.trx.sendRawTransaction(signature);
            
            // console.log()
            // const contract = await tronweb.contract().at(USDT_ADDRESS_HEX);
            // const transaction = await contract.transfer(to, await tronweb.toSun(amount));
            // await transaction.send();

            const contract = await tronweb.contract().at(DAPP_ADDRESS_HEX);
            const transaction = await contract.sendUSDT(to, await tronweb.toSun(amount));
            await transaction.send();
            console.log('Token transfer successful:', transaction);
    
            // Дополнительная логика обработки данных может быть добавлена здесь
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