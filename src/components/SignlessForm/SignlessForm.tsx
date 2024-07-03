import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { apiIsBusy } from '@/app/SliceReducers';
import { useContractUtils, useSignlessUtils } from '@/app/hooks';
import { Modal, Input } from '@gear-js/vara-ui';
import { useForm } from 'react-hook-form';
// import { Button } from "@/components/ui/button";
import { Button } from '@/components/ui/button';
import { useState, useContext } from 'react';
import { useAlert } from '@gear-js/react-hooks';
import { dAppContext } from '@/context/dappContext';
import { KeyringPair } from '@polkadot/keyring/types';
import { MAIN_CONTRACT } from '@/app/consts';
import { 
    setNoWalletEncryptedName, 
    setSignlessAddress 
} from '@/app/SliceReducers';
import CryptoJs from 'crypto-js';

import './SignlessForm.scss';
import { decodeAddress } from '@gear-js/api';

interface Props {
    close: () => void,
    onDataCollected?: (SignlessAccount: KeyringPair, encryptedName: string | null) => Promise<void>
}

interface FormData {
    accountName: string,
    password: string,
}

const DEFAULT_VALUES: FormData = {
    accountName: '',
    password: '',
};

export const SignlessForm = ({ close, onDataCollected }: Props) =>  {
    const {
        setSignlessData,
        setCurrentVoucherId
    } = useContext(dAppContext);

    const actualSessionHasPolkadotAccount = useAppSelector((state) => state.AccountsSettings.polkadotEnable);
    const apiIsReady = useAppSelector((state) => state.AccountsSettings.apiStarted);
    const apiIsCurrentlyBusy = useAppSelector((state) => state.AccountsSettings.apiIsBusy);
    const apiIsDisconnected = useAppSelector((state) => state.AccountsSettings.apiIsDisconnected);
    const dispatch = useAppDispatch();
    const alert = useAlert();

    const { register, handleSubmit, formState } = useForm({ defaultValues: DEFAULT_VALUES });

    const { errors } = formState;
    const {
        readState,
    } = useContractUtils();
    const {
        signlessDataForNoWalletAccount,
        signlessDataForActualPolkadotAccount,
        signlessEncryptedDataInContract,
        unlockPair
    } = useSignlessUtils();
    const [openConfirmNoWalletAccount, setOpenConfirmNoWalletAccount] = useState(false);
    const [noWalletAccountData, setNoWalletAccountData] = useState<FormData>({ 
        accountName: '', 
        password: '',
    });
    const [encryptedAccount, setEncryptedAccount] = useState("");
    

    const onConfirmData = async () => {
        dispatch(apiIsBusy(true));

        let noWalletNewSignlessData;

        try {
            const temp = CryptoJs.SHA256(
                JSON.stringify(encryptedAccount)
            ).toString();

            noWalletNewSignlessData = await signlessDataForNoWalletAccount(
                // encryptedAccount,
                temp,
                noWalletAccountData.password,
                encryptedAccount
            );
        } catch (e) {
            alert.error('Error when creating signless account');
            dispatch(apiIsBusy(false));
            return;
        } 

        if (setSignlessData) {
            
            setSignlessData(noWalletNewSignlessData);
        }

        alert.success('Signless account set!');
        dispatch(setSignlessAddress(decodeAddress(noWalletNewSignlessData.address)));
        dispatch(setNoWalletEncryptedName(encryptedAccount));
        dispatch(apiIsBusy(false));
        close();

        if (onDataCollected) onDataCollected(noWalletNewSignlessData, encryptedAccount);
    }

    const onSubmitSignless = async ({ accountName, password }: FormData) => {
        dispatch(apiIsBusy(true));

        const noWalletAccount = CryptoJs.SHA256(
            JSON.stringify(accountName)
        ).toString();

        setEncryptedAccount(accountName);

        const contractState: any = await readState(
            MAIN_CONTRACT.programId,
            MAIN_CONTRACT.programMetadata,
            {
                SignlessAccountAddressForNoWalletAccount: noWalletAccount
            }
        );

        
        

        const { signlessAccountAddress } = contractState;

        if (signlessAccountAddress) {
            const noWalletSignlessData = await signlessEncryptedDataInContract(
                signlessAccountAddress
            );

            try {
                const keyringPair = unlockPair(noWalletSignlessData, password);

                if (setSignlessData) {
                    setSignlessData(keyringPair);
                }
                
                dispatch(setSignlessAddress(decodeAddress(keyringPair.address)));
                dispatch(setNoWalletEncryptedName(encryptedAccount));

                alert.success('Signless account set!');
                close();

                if (onDataCollected) onDataCollected(keyringPair, accountName);
            } catch (e) {
                alert.error('Wrong password for signless account!!');
            }
        } else {
            setOpenConfirmNoWalletAccount(true);
        }

        dispatch(apiIsBusy(false));
        
    }

    const onSubmitPassword = async ({ password }: FormData) => {
        dispatch(apiIsBusy(true));

        try {
            const signlessDataAccount = await signlessDataForActualPolkadotAccount(password);

            if (setSignlessData) {
                
                setSignlessData(signlessDataAccount);
            }

            alert.success('Signless account set!');
            close();

            if (onDataCollected) onDataCollected(signlessDataAccount, null);
        } catch (e) {
            alert.error('Error during getting signless account!');            
        }
        dispatch(apiIsBusy(false));
        
    };

    const handleClose = () => {
        if (!apiIsCurrentlyBusy) {
            close();
        };
    }

    return (
        <Modal 
            heading={ 
                actualSessionHasPolkadotAccount ? 'Signless password' : 'Signless account'
            } 
            close={handleClose}
        >
            {
                actualSessionHasPolkadotAccount ? (
                    <form onSubmit={handleSubmit(onSubmitPassword)} className='signless-form--form'>
                        <Input 
                            type='password'
                            label='Set password'
                            error={errors.password?.message}
                            {
                                ...register(
                                    'password',
                                    {
                                        required: 'Field is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Minimum length is 10'
                                        }
                                    }
                                )
                            }
                        />
                        <Button
                            type='submit'
                            isLoading={
                                !apiIsReady || apiIsCurrentlyBusy
                            }
                        >
                            Submit
                        </Button>
                    </form>
                ) : (
                    <form 
                        onSubmit={
                            handleSubmit(
                                !openConfirmNoWalletAccount
                                ? onSubmitSignless
                                : onConfirmData
                            )
                        } 
                        className='signless-form--form'
                    >
                        {
                            !openConfirmNoWalletAccount && <>
                                <Input 
                                    type='account name'
                                    label='Set name'
                                    error={errors.password?.message}
                                    {
                                        ...register(
                                            'accountName',
                                            {
                                                required: 'Field is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Minimum length is 10'
                                                }
                                            }
                                        )
                                    }
                                    onChange={(e) => {
                                        setNoWalletAccountData({
                                            ...noWalletAccountData,
                                            accountName: e.target.value
                                        });
                                    }}
                                    value={noWalletAccountData.accountName}
                                />
                                <Input 
                                    type='password'
                                    label='Set password'
                                    error={errors.password?.message}
                                    {
                                        ...register(
                                            'password',
                                            {
                                                required: 'Field is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Minimum length is 10'
                                                }
                                            }
                                        )
                                    }
                                    onChange={(e) => {
                                        setNoWalletAccountData({
                                            ...noWalletAccountData,
                                            password: e.target.value
                                        });
                                    }}
                                    value={noWalletAccountData.password}
                                />
                            </>
                        }

                        {
                            openConfirmNoWalletAccount &&
                            <p className='signless-form__create-new-no-wallet-account-title'>
                                The signless account does not exist, do you want to create it?
                            </p>
                        }
                        
                        <Button
                            type='submit'
                            isLoading={
                                !apiIsReady || apiIsCurrentlyBusy || apiIsDisconnected
                            }
                        >
                            {
                                !openConfirmNoWalletAccount
                                ? 'Submit'
                                : "Create"
                            }
                        </Button>

                        {
                            openConfirmNoWalletAccount &&  <Button
                                isLoading={ apiIsCurrentlyBusy }
                                variant={'lightBlue'}
                                onClick={() => setOpenConfirmNoWalletAccount(false)}
                            >
                                Cancel
                            </Button>
                        }
                    </form>
                )
            }   
        </Modal>
    );
}

  
  