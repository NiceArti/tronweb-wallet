'use client'

import React from 'react';
import { cn } from '@/shared/utils';
import { FaArrowsRotate } from "react-icons/fa6";


export const Spinner = React.memo<{className?: string, classNameIcon?: string}>(function({className, classNameIcon}) {
    return (
        <div className={className}>
            <div className={'relative animate-spin w-fit h-fit'}>
                <FaArrowsRotate
                    className={cn('absolute text-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', classNameIcon)}
                    /> 
            </div>
        </div>
    );
});

Spinner.displayName = 'Spinner';
