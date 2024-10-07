'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { cn } from '@/shared/utils';

import { RiFileCopyLine } from "react-icons/ri";


export const ConnectedButton = React.memo<{
    address?: string,
    className?: string,
    onClick?: () => void,
    onDisconnect?: () => void,
}>(function({
    address,
    className,
    onClick,
    onDisconnect,
}) {
    const [truncatedAddress, setTruncatedAddress] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [isOpen, setOpened] = useState<boolean>(false);


    useEffect(() => {
        if(!address) {
            return;
        }
        if (address.length <= 6) {
            setTruncatedAddress(address);
        }
        
        setTruncatedAddress(address.slice(0, 6) + '...' + address.slice(-6));
    }, [address]);



    const handleCopyToClipboard = useCallback((): boolean => {
        if(!address) {
            return false;
        }

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                navigator.clipboard.writeText(address).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }).catch((error) => {
                    console.error('Failed to copy address: ', error);
                });

                return true;
            } catch (error) {
                console.error('Failed to copy using Clipboard API:', error);
                return false;
            }
        } else {
            // Резервный способ с использованием document.execCommand
            const textArea = document.createElement('textarea');
            textArea.value = address;
            textArea.style.position = 'fixed'; // избегаем скроллирования страницы
            textArea.style.opacity = '0'; // скрываем элемент
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
        
            try {
                const successful = document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                document.body.removeChild(textArea);
                return successful;
            } catch (error) {
                console.error('Failed to copy using execCommand:', error);
                document.body.removeChild(textArea);
                return false;
            }
        }
    }, [copied, address]);


    return (
        <Popover onOpenChange={(open: boolean) => setOpened(open)} open={isOpen}>
            <PopoverTrigger asChild>
                <Button
                    onClick={onClick}
                    className={cn('text-xs font-bold text-white h-14 w-full rounded-full', className)}
                >
                    {truncatedAddress}
                </Button>
            </PopoverTrigger>
            
            <PopoverContent className="bg-black mt-3">
                <Button className='w-full' onClick={handleCopyToClipboard}>
                    <div className='inline-flex gap-3 justify-between items-center'>
                        <RiFileCopyLine className='text-lg' />
                        {copied ? 'Coppied!' : 'Copy Address'}
                    </div>
                </Button>
                <Button
                    className='w-full mt-3'
                    variant={'outline'}
                    onClick={() => {
                        setOpened(false);
                        onDisconnect?.();
                    }}
                >
                    Disconnect
                </Button>
            </PopoverContent>
        </Popover>
    );
});

ConnectedButton.displayName = 'ConnectedButton';