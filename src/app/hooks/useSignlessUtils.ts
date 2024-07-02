import { GearKeyring, HexString, decodeAddress } from '@gear-js/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { useContractUtils } from './useContractUtils';
import { useVoucherUtils } from './useVoucherUtils';
import { mnemonic, account_name, MAIN_CONTRACT } from '../consts';
import { useAccount, useAlert } from '@gear-js/react-hooks';

/**
 * Custom hook for managing subaccounts to add Signless to the dapp
 * @returns Functions to handle signless accounts
 * @example
 * // Import functions
 * const {
 *     createNewPairAddress,
 *     lockPair,
 *     unlockPair
 * } = useSignlessUtils();
 * 
 * // Create new KeyringPair for signless session
 * let signlessAccountPair = createNewPairAddress();
 * 
 * // Lock KeyringPair with password
 * const signlessAccountLocked = lockPair(signlessAccountPair, "password");
 * 
 * // Unlock KeyringPair with password that locks the signless account
 * signlessAccountPair = unlockPair(signlessAccountLocked, "password");
 */
export const useSignlessUtils = (name?: string) => {
    const {
        sendMessageWithSignlessAccount,
        readState
    } = useContractUtils();
    const {
        generateNewVoucher,
    } = useVoucherUtils(account_name, mnemonic);
    const { account } = useAccount();
    const alert = useAlert();

    /**
     * @returns New KeyringPair for signless account
     */
    const createNewPairAddress = async (): Promise<KeyringPair> => {
        return new Promise(async (resolve, reject) => {
            const signlessName = name === undefined ? "signlessPair" : name;
            try {
                const newPair = await GearKeyring.create(signlessName);
                resolve(newPair.keyring);
            } catch (e) {
                console.log("Error creating new account pair!");
                reject(e);
            }
        });
    };

    /**
     * Function to obtain the "locked" version of the signless account
     * @param pair KeyringPair of signless account to lock
     * @param password String to be used to lock the KeyringPair of the signless account
     * @returns a KeyringPair$Json from a locked signless account
     * @example
     * const lockedVersionOfSignlessAccount = lockPair(
     *     signlessAccount,
     *     'signlessAccountPassword'
     * );
     * 
     * console.log('Locked signless data:');
     * console.log(lockedVersionOfSignlessAccount);
     */
    const lockPair = (pair: KeyringPair, password: string): KeyringPair$Json => {
        return pair.toJson(password);
    }
 
    /**
     * Function to unlock the "locked" version of the signless account (a "try" is needed in case the password is incorrect)
     * @param pair Locked signless account
     * @param password string that was previously used to block the signless account
     * @returns The KeyringPair of the locked signless account
     * @example
     * const signlessAccount = unlockPair(
     *     lockedSignlessAccount,
     *     'signlessAccountPassword'
     * );
     * 
     * console.log('Signless data:');
     * console.log(signlessAccount);
     */
    const unlockPair = (pair: KeyringPair$Json, password: string): KeyringPair => {
        return GearKeyring.fromJson(pair, password);
    }

    /**
     * Gives a correct format to the blocked signless account that was obtained from the contract, so that it can be unblocked
     * @param signlessData Account blocked from giving the correct format
     * @returns Correct signless account (KeyringPair) for later use
     * @example
     * const signlessDataFromContract = readState(...);
     * const signlessLockedData = formatContractSignlessData(
     *     signlessDataFromContract
     * );
     * 
     * console.log('Cuenta signless bloqueada');
     * console.log(signlessLockedData);
     */
    const formatContractSignlessData = (signlessData: any): KeyringPair$Json => {
        const formatEncryptedSignlessData = { ...signlessData };
        const encodingType = formatEncryptedSignlessData.encoding.encodingType;
        delete formatEncryptedSignlessData.encoding['encodingType'];
        formatEncryptedSignlessData.encoding['type'] = encodingType;
    
        return formatEncryptedSignlessData;
      }
    
      /**
       * Gives the correct format to the information of a locked signless account to send it to the contract
       * @param pair locked signless account to format it
       * @returns locked signless account with the correct format
       * @example
       * const formatedLockedSignlessData = modifyPairToContract(
       *     lockedSignlessAccount
       * );
       * 
       * console.log('Formated locked account:');
       * console.log(formatedLockedSignlessData);
       */
      const modifyPairToContract = (pair: KeyringPair$Json) => {
        const signlessToSend = JSON.parse(JSON.stringify(pair));
        const encodingType = signlessToSend.encoding.type;
        delete signlessToSend.encoding['type'];
        signlessToSend.encoding['encodingType'] = encodingType;
    
        return signlessToSend;
    }






















    const signlessDataForNoWalletAccount = async (noWalletAccount: string, password: string): Promise<KeyringPair> => {
        return new Promise(async (resolve, reject) => {
          const newKeyringPair = await createNewPairAddress();
          const lockedPair = lockPair(newKeyringPair, password);
        
          let voucherId; 

          try {
            voucherId = await generateNewVoucher(
                [MAIN_CONTRACT.programId],
                decodeAddress(newKeyringPair.address),
                3,
                1_200,
                () => alert.success('Voucher created!'),
                () => alert.error('Error while creating voucher'),
                () => alert.info('Voucher will be created')
            );
            
            // await generateNewVoucher(
            //   contractId,
            //   decodeAddress(newKeyringPair.address)
            // );
          } catch(e) {
            reject('Api cant create voucher for signless account');
            return;
          }
    
          try {
            await sendMessageWithSignlessAccount(
                newKeyringPair,
                MAIN_CONTRACT.programId,
                voucherId,
                MAIN_CONTRACT.programMetadata,
                {
                    BindSignlessAddressToNoWalletAccount: {
                      noWalletAccount,
                      signlessData: modifyPairToContract(lockedPair)
                    }
                },
                0,
                () => alert.success('Signless account created!'),
                () => alert.error('Cant create signless subaccount'),
                () => alert.info('Signless message is in block'),
                () => alert.info('Will load creation of signless account')
            );
            // await sendMessageWithSignlessAccount(
            //   newKeyringPair,
            //   contractId,
            //   ProgramMetadata.from(MAIN_CONTRACT.programMetadata),
            //   {
            //     BindSignlessAddressToNoWalletAccount: {
            //       noWalletAccount,
            //       signlessData: modifyPairToContract(lockedPair)
            //     }
            //   },
            //   0,
            //   "Signless accouunt created!",
            //   "Cant set signless account!",
            //   "creating signless subaccount",
            //   "VaraBlocks: "
            // );
          } catch(e) {
            reject('Api cant send message');
            return;
          }
    
          resolve(newKeyringPair);
        });
    }

    const signlessDataForActualPolkadotAccount = async (password: string): Promise<KeyringPair> => {
        return new Promise(async (resolve, reject) => {
          if (!account) {
            console.log('Account is not ready');
            reject('Account is no ready');
            return;
          }
    
          let signlessAddress;
          let keyringPair;
          let voucherId;
    
          try {
            signlessAddress = await signlessAddressForPolkadotAccount();
          } catch (e) {
            reject('Error reading state for contract');
            return;
          }
    
          if (!signlessAddress) {
            keyringPair = await createNewPairAddress();
            const lockedPair = lockPair(keyringPair, password);
    
            try {
                voucherId = await generateNewVoucher(
                    [MAIN_CONTRACT.programId],
                    decodeAddress(keyringPair.address),
                    3,
                    1_200,
                    () => alert.success('Voucher created!'),
                    () => alert.error('Error while creating voucher'),
                    () => alert.info('Voucher will be created')
                );
            //   await generateNewVoucher(
            //     contractId,
            //     decodeAddress(keyringPair.address)
            //   );
            } catch(e) {
              reject('Api cant create voucher for signless account');
              return;
            }
            
            try {
                await sendMessageWithSignlessAccount(
                    keyringPair,
                    MAIN_CONTRACT.programId,
                    voucherId,
                    MAIN_CONTRACT.programMetadata,
                    {
                        BindSignlessAddressToAddress: {
                          userAccount: account.decodedAddress,
                          signlessData: modifyPairToContract(lockedPair)
                        }
                    },
                    0,
                    () => alert.success('Signless account created!'),
                    () => alert.error('Cant set signless subaccount'),
                    () => alert.info('Signless message is in block'),
                    () => alert.info('Will load creation of signless account')
                );
            //   await sendMessageWithSignlessAccount(
            //     keyringPair,
            //     contractId,
            //     ProgramMetadata.from(MAIN_CONTRACT.programMetadata),
            //     {
            //       BindSignlessAddressToAddress: {
            //         userAccount: account.decodedAddress,
            //         signlessData: modifyPairToContract(lockedPair)
            //       }
            //     },
            //     0,
            //     "Signless accouunt created!",
            //     "Cant set signless account!",
            //     "creating signless subaccount",
            //     "VaraBlocks: "
            //   );
            } catch(e) {
              reject('Api cant send message');
              return;
            }
    
          } else {
            let encryptedSignlessAccount;
    
            try {
              encryptedSignlessAccount = await signlessEncryptedDataInContract(signlessAddress);
            } catch(e) {
              alert.error('Error reading state of contract');
              reject('Error reading state of contract');
              return;
            }
            
            try {
              keyringPair = unlockPair(encryptedSignlessAccount, password);
            } catch (e) {
              alert.error('Wrong password for signless account!!');
              reject('Wrong signless password');
              return;
            }
          }
    
          resolve(keyringPair);
        });
    }

    const signlessEncryptedDataInContract = async (signlessAddress: HexString): Promise<KeyringPair$Json> => {
        return new Promise(async (resolve, reject) => {
          try {
            const contractState: any = await readState(
              MAIN_CONTRACT.programId,
              MAIN_CONTRACT.programMetadata,
              {
                SignlessAccountData: signlessAddress
              }
            );
    
            const { signlessAccountData } = contractState;
    
            const formatedEncryptedSignlessData = formatContractSignlessData(
              JSON.parse(JSON.stringify(signlessAccountData))
            );
            
            resolve(formatedEncryptedSignlessData);
          } catch (e) {
            reject('Error while reading state');
          }
        });
    }

    const signlessAddressForPolkadotAccount = async (): Promise<HexString | null> => {
        return new Promise(async (resolve, reject) => {
          if (!account) {
            console.log('Account is not ready');
            reject('Account is no ready');
            return;
          }
    
          const contractState: any = await readState(
            MAIN_CONTRACT.programId,
            MAIN_CONTRACT.programMetadata,
            {
              SignlessAccountAddressForAddress: account.decodedAddress
            }
          );
    
          const { signlessAccountAddressForAddress } = contractState;
    
          resolve(signlessAccountAddressForAddress);
        });
      }


    return {
        createNewPairAddress,
        lockPair,
        unlockPair,
        formatContractSignlessData,
        modifyPairToContract,

        signlessDataForNoWalletAccount,
        signlessDataForActualPolkadotAccount,
        signlessEncryptedDataInContract,
        signlessAddressForPolkadotAccount
    }
}