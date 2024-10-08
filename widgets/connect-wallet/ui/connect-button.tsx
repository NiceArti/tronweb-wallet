'use client'

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button, type ButtonProps } from '@/shared/ui';
import { cn } from '@/shared/utils';
import Link from 'next/link';



export const ConnectButton = React.forwardRef<HTMLButtonElement, {icon?: any, imageIcon?: StaticImageData, href: string, children?: React.ReactNode, className?: string, onClick?: ()=> void}>(function({
    children,
    icon,
    imageIcon,
    className,
    href,
    onClick,
    ...props
}, ref) {
    return (
        <div className='inline-flex items-center'>
            <div className='w-24 inline-flex justify-center'>
                <div className='mx-auto'>
                    {icon ? icon : <></>}
                    {imageIcon ? <Image {...imageIcon} alt='Brand Logo' /> : <></>}
                </div>
            </div> 
            <Link {...props} href={href} className={cn('text-xs font-bold text-white h-14 w-full rounded-full flex flex-row justify-center items-center', className)} onClick={onClick}>
                {children}
            </Link>
        </div>
    );
});