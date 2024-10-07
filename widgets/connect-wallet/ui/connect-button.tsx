'use client'

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Button, type ButtonProps } from '@/shared/ui';
import { cn } from '@/shared/utils';



export const ConnectButton = React.forwardRef<HTMLButtonElement, ButtonProps & {icon?: any, imageIcon?: StaticImageData}>(function({
    children,
    icon,
    imageIcon,
    className,
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
            <Button {...props} ref={ref} className={cn('text-xs font-bold text-white h-14 w-full rounded-full', className)}>
                {children}
            </Button>
        </div>
    );
});