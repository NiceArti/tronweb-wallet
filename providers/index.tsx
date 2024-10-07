'use client';

import { FC } from 'react';
import { Web3Provider } from './web3';


export const Provider: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Web3Provider>
			{children}
		</Web3Provider>
	);
};
