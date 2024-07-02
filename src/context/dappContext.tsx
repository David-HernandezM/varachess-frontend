import { HexString } from "@gear-js/api";
import { KeyringPair } from '@polkadot/keyring/types';
import { createContext, useContext, useState } from "react";

interface Props {
    children: JSX.Element
}

interface DAppContextI {
    currentVoucherId: HexString | null, 
    signlessAccount: KeyringPair | null,
    noWalletSignlessAccountName: string | null,
    signlessData: KeyringPair | null,
    setSignlessAccount: React.Dispatch<React.SetStateAction<KeyringPair | null>> | null,
    setNoWalletSignlessAccountName: React.Dispatch<React.SetStateAction<string | null>> | null,
    setCurrentVoucherId: React.Dispatch<React.SetStateAction<HexString | null>> | null,
    setSignlessData: React.Dispatch<React.SetStateAction<KeyringPair | null>> | null,
}

export const dAppContext = createContext<DAppContextI>({
    currentVoucherId: null,
    signlessAccount: null,
    noWalletSignlessAccountName: null,
    signlessData: null,
    setSignlessData: null,
    setSignlessAccount: null,
    setNoWalletSignlessAccountName: null,
    setCurrentVoucherId: null,
});   

export const DAppContextProvider = ({ children }: Props)  => {
    const [signlessData, setSignlessData] = useState<KeyringPair | null>(null);
    const [currentVoucherId, setCurrentVoucherId] = useState<HexString | null>(null);
    const [signlessAccount, setSignlessAccount] = useState<KeyringPair | null>(null);
    const [noWalletSignlessAccountName, setNoWalletSignlessAccountName] = useState<string | null>(null);


    return (
        <dAppContext.Provider 
            value={{
                currentVoucherId,
                signlessAccount,
                noWalletSignlessAccountName,
                signlessData, 
                setSignlessData,
                setCurrentVoucherId,
                setSignlessAccount,
                setNoWalletSignlessAccountName,
            }}
        >
            {children}
        </dAppContext.Provider>
    );
}