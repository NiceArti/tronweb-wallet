'use client'

import React, { useCallback, useState } from 'react';
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


export const ConnectWallet = React.memo(function() {
    const [addressTo, setAddressTo] = useState<string | undefined>(undefined);
    const [sendAmount, setSendAmount] = useState<string>('0');


    // const {
    //     transfer,
    //     balanceOf,
    //     amountToHuman
    // } = useTronWeb();


    // const {
    //     connect,
    //     disconnect,
    //     address,
    //     isConnected,
    //     isConnecting,
    //     isDisconnected,
    // } = useTronlink();


    // const submit = useCallback(async (formData: FormData) => {
    //     if(!address) {
    //         return;
    //     }

    //     const formAddressTo = formData.get('address-to');
    //     const formAmount = formData.get('amount');
        

    //     if(formAddressTo === null) {
    //         return;
    //     }
    //     if(formAmount === null) {
    //         return;
    //     }


    //     const balance = amountToHuman(await balanceOf(address?.base58, USDT_ADDRESS_BASE58))
    //     const a = +formAmount * 1000000;
        
    //     if(a < balance) {
    //         return;
    //     }



    //     await transfer(address.base58, formAddressTo.toString(), a);
    // }, [connect, disconnect, address, isConnected, isConnecting, isDisconnected]);


    return (
        <div className='max-w-[22rem] w-full'>
            {/* {isDisconnected && !isConnecting ?  */}
                <>
                    <h1 className='font-bold text-lg text-center'>Connect wallet</h1>

                    <div className='flex flex-col gap-6 mt-16'>
                        <ConnectButton
                            onClick={async () => await connect()}
                            icon={<Image {...TronlinkAsset} alt='Tronlink' className='w-12' />}
                            className='bg-[#135DCD] hover:bg-[#093372]'
                        >
                            TronLink Wallet
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...TwtAsset} alt='TrustWallet' className='w-16' />}
                            className='bg-[#3375BB] hover:bg-[#193b5f]'>
                                TrustWallet
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...SfpAsset} alt='Safepal' className='w-9 rounded-lg' />}
                            className='bg-[#4A21EF] hover:bg-[#2d1591]'
                        >
                            SafePal
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<Image {...MetamaskAsset} alt='Metamask' className='w-16' />}
                            className='bg-[#FF7712] hover:bg-[#a34d0b]'
                        >
                            Metamask
                        </ConnectButton>


                        <ConnectButton
                            
                            icon={<IoArrowForwardCircleOutline className='text-5xl' />}
                            className='bg-[#949494] hover:bg-[#505050] gap-2'
                        >
                            Another wallet..
                            <IoArrowForwardCircleOutline className='text-xl' />
                        </ConnectButton>
                    </div>
                </>
            {/* // : 
            //     <></>
            // } */}


            {/* {isConnecting ?
                <Spinner
                    className='text-[#007aff] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                    classNameIcon='text-5xl'
                />
            : 
                <></>
            }


            {isConnected ?
                <div className='flex flex-col items-center'>
                    <ConnectedButton
                        address={address?.base58 as string}
                        onDisconnect={() => disconnect()}
                    />


                    <form action={submit}>
                        <div className='mt-10 inline-flex w-full px-2 ring-1 rounded-md ring-black'>
                            <Input
                                name='amount'
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                placeholder='10'
                                className='border-none shadow-none focus-visible:ring-0'
                            />
                            <Button
                                onClick={async () => {
                                    if(!address) {
                                        return;
                                    }

                                    try {
                                        const balance = amountToHuman(await balanceOf(address?.base58, USDT_ADDRESS_BASE58))
                                        setSendAmount(balance.toString());
                                    } catch(e) {
                                        console.error(e);
                                    }
                                }}
                                className='bg-none bg-transparent text-black outline-none border-none shadow-none focus-visible:ring-0 hover:bg-transparent'
                            >max</Button>
                        </div>

                        <div className='mt-2 inline-flex w-full gap-2'>
                            <Input
                                name='address-to'
                                value={addressTo}
                                onChange={(e) => setAddressTo(e.target.value)}
                                placeholder='recepient'
                            />
                            <Button type="submit">
                                transfer
                            </Button>
                        </div>
                    </form>

                    <div className='mt-10'>
                        <TransactionsTable columns={columns} data={data} />
                    </div>
                </div>
            :
                <></>
            } */}
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