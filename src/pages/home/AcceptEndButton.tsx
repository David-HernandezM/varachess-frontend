
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { HexString, ProgramMetadata, decodeAddress } from "@gear-js/api";
import { Button } from "@chakra-ui/react";
import {useState, useContext} from 'react';

import { MAIN_CONTRACT } from "@/app/consts";
import { SignlessForm } from "@/components/SignlessForm/SignlessForm";
import { dAppContext } from "@/context/dappContext";
import { useContractUtils, useVoucherUtils } from "@/app/hooks";
import { mnemonic, account_name } from "@/app/consts";
import { useAppSelector } from "@/app/hooks";
import { KeyringPair } from '@polkadot/keyring/types';
import CryptoJs from 'crypto-js';

interface AcceptContractProps {
  parentSetContract: (arg1: string) => void;
  gameId: string;
}

const AcceptEndButton:React.FC <AcceptContractProps> = ( { parentSetContract, gameId} ) => {


//const AcceptEndButton:React.FC = ( ) => {
  const alert = useAlert();
  const { accounts, account } = useAccount();
  const { api } = useApi();

  const [buttonMsg, setButtonMsg] = useState<string>(' Accept and Load to Vara Network ')
  const [disableButton, setDisableButton] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)

  const [userFillingTheForm, setUserFillingTheForm] = useState(false);

  const TVara = 1_000_000_000_000;

  const metadata = ProgramMetadata.from(MAIN_CONTRACT.programMetadata);

  const message: any = {
    // destination: programIDFT, // programId
    destination: MAIN_CONTRACT.programId,

    gasLimit: 899819245,
    value: 0,

    payload: { 
      EndGame: {
        game_id: gameId,
        result_game: "Lose",
        position_end_game: "Player " + account?.address + " forfeited game",
                      
      } 
    }
  };





  const polkadotAccountIsEnable = useAppSelector((state) => state.AccountsSettings.polkadotEnable);
  const gaslessIsSelected = useAppSelector((state) => state.AccountsSettings.gaslessIsActive);

  const { 
    currentVoucherId,
    signlessAccount, 
    noWalletSignlessAccountName,
    setCurrentVoucherId,
    setSignlessAccount,
    setNoWalletSignlessAccountName
  } = useContext(dAppContext);
  const {
      sendMessageWithVoucher,
      sendMessageWithSignlessAccount
  } = useContractUtils();
  const {
      generateNewVoucher,
      checkVoucherForUpdates,
      vouchersInContract
  } = useVoucherUtils(account_name, mnemonic);



  const voucherIdOfActualPolkadotAccount = async (): Promise<HexString[]> => {
    return new Promise(async (resolve, reject) => {
        if (!account) {
            alert.error('Account is not ready');
            reject('Account is not ready');
            return;
        }

        const vouchersId = await vouchersInContract(
          MAIN_CONTRACT.programId,
          account.decodedAddress
        );

        resolve(vouchersId);
    });
  }

  const manageVoucherId = async (voucherId: HexString): Promise<void> => {
      return new Promise(async (resolve, reject) => {
          if (!account) {
              alert.error('Account is not ready');
              reject('Account is not ready');
              return;
          }

          try {
              await checkVoucherForUpdates(
                  account.decodedAddress, 
                  voucherId,
                  1, // add one token to voucher if needed
                  1_200, // new expiration time (One hour )
                  2, // Minimum balance that the voucher must have
                  () => alert.success('Voucher updated!'),
                  () => alert.error('Error while checking voucher'),
                  () => alert.info('Will check for updates in voucher')
              )
              resolve();
          } catch (e) {
              alert.error('Error while check voucher');
          }
      });
  }

  const createVoucherForCurrentPolkadotAccount = async (): Promise<HexString> => {
      return new Promise(async (resolve, reject) => {
          if (!account) {
              alert.error('Account is not ready');
              reject('Account is not ready');
              return;
          }

          const voucherIdCreated = await generateNewVoucher(
              [MAIN_CONTRACT.programId], // An array to bind the voucher to one or more contracts
              account.decodedAddress,
              2, // 2 tokens
              30, // one minute
              () => alert.success('Voucher created!'),
              () => alert.error('Error while creating voucher'),
              () => alert.info('Will create voucher for current polkadot address!'),
          );

          if (setCurrentVoucherId) setCurrentVoucherId(voucherIdCreated);

          resolve(voucherIdCreated);
      });
  }


  const signer = async () => {
    if (!account) {
      alert.error("Accounts not ready!");
      return;
    }

    let voucherIdToUse;
    
    if (!currentVoucherId) {
        const vouchersForAddress = await voucherIdOfActualPolkadotAccount();

        if (vouchersForAddress.length === 0) {
            voucherIdToUse = await createVoucherForCurrentPolkadotAccount();
        } else {
            voucherIdToUse = vouchersForAddress[0];

            if (setCurrentVoucherId) setCurrentVoucherId(voucherIdToUse);

            await manageVoucherId(voucherIdToUse);
        }
    } else {
        await manageVoucherId(currentVoucherId);
        voucherIdToUse = currentVoucherId;
    }

    try {
        await sendMessageWithVoucher(
            account.decodedAddress,
            voucherIdToUse,
            account.meta.source,
            MAIN_CONTRACT.programId,
            MAIN_CONTRACT.programMetadata,
            { 
              EndGame: {
                endGame: {
                  game_id: gameId,
                  result_game: "Lose",
                  position_end_game: "Player " + account?.address + " forfeited game",
                                
                },
                messageData: [null, null]
              }
            },
            1* TVara,
            () => {     
              alert.success('Message send with voucher!')
              parentSetContract('UNINITIATED');
              setButtonMsg("Results were loaded to Vara Network!")
              setDisableButton(true)
              setLoadingButton(false)
            },
            () =>{ 
              alert.error('Failed while sending message with voucher')
              setDisableButton(false)
              setLoadingButton(false)
            },
            () => {
              alert.info('Message is in blocks')
              setButtonMsg("Please wait, connecting to vara network")
              setDisableButton(true)
              setLoadingButton(true)
            },
            () => alert.info('Will send message')
        );
    } catch (e) {
        alert.error('Error while sending message');
    }
  }






  const sendMessageWithSignlessData = async (payload: any) => {
    if (!signlessAccount) {
        alert.error('no signless account!');
        return
    }

    if (!currentVoucherId) {

      alert.error('No voucher for sigless account!');
      return;
    }

    try {
        await checkVoucherForUpdates(
            decodeAddress(signlessAccount.address),
            currentVoucherId,
            1,
            1_200, 
            2,
            () => alert.success('Voucher get an update!'),
            () => alert.error('Error while updating voucher'),
            () => alert.info('Check voucher for updates...')
        );
    } catch(e) {
        alert.error('Error while updating signless account voucher');
        return;
    }

    try {
        await sendMessageWithSignlessAccount(
            signlessAccount,
            MAIN_CONTRACT.programId,
            currentVoucherId,
            MAIN_CONTRACT.programMetadata,
            payload,
            0,
            () => {
              alert.success('Message send with signless Account!');
              parentSetContract('UNINITIATED');
              setButtonMsg("Results were loaded to Vara Network!")
              setDisableButton(true)
              setLoadingButton(false)
            },
            () => {
              alert.error('Error while sending message')
              setDisableButton(false)
              setLoadingButton(false)
            },
            () => {
              alert.info('Message in block!')
              setButtonMsg("Please wait, connecting to vara network")
              setDisableButton(true)
              setLoadingButton(true)
            },
            () => alert.info('Will send a message')
        )
    } catch (e) {
        alert.error('Error while sending signless account');
        return;
    }
}







  const handleClick = async () => {
    // console.log('Se abrio el modal!');
    // setUserFillingTheForm(true);

    if (polkadotAccountIsEnable) {
      if (!gaslessIsSelected) {
        if (!signlessAccount) {
          setUserFillingTheForm(true);
          return;
        }

        await sendMessageWithSignlessData(
          {
            // RequestStartGame: {
            //   requestGameStart: {
            //     game_id: gameId,
            //     player_bet: 0,
            //     player1:  account?.decodedAddress,
            //   },
            //   messageData: [account?.decodedAddress, null]
            // }
            EndGame: {
              endGame: {
                game_id: gameId,
                result_game: "Lose",
                position_end_game: "Player " + account?.address + " forfeited game",
                              
              },
              messageData: [account?.decodedAddress, null]
            }
          }
        );
      } else {
        // using wallet voucher session.
        await signer();
      }
    } else {
      if (!signlessAccount) {
        setUserFillingTheForm(true);
        return;
      }

      const temp = CryptoJs.SHA256(
        JSON.stringify(noWalletSignlessAccountName)
      ).toString();

      await sendMessageWithSignlessData(
        {
          // RequestStartGame: {
          //   requestGameStart: {
          //     game_id: gameId,
          //     player_bet: 0,
          //     player1:  decodeAddress(signlessAccount.address),
          //   },
          //   messageData: [null, temp]
          // }
          EndGame: {
            endGame: {
              game_id: gameId,
              result_game: "Lose",
              position_end_game: "Player " + account?.address + " forfeited game",
                            
            },
            messageData: [null, temp]
          }
        }
      );
    }
  }
  

  const manageSignlessAccount = (signlessAccount: KeyringPair, encryptedName: string | null) : Promise<void> => {
    return new Promise(async (resolve, reject) => {
      
      
      if (setSignlessAccount) setSignlessAccount(signlessAccount);
      if (setNoWalletSignlessAccountName) setNoWalletSignlessAccountName(encryptedName ?? "no-wallet-singless-name");

      try {
        const signlessVoucherId = await vouchersInContract(
          MAIN_CONTRACT.programId, 
          decodeAddress(signlessAccount.address)
        );

        if (setCurrentVoucherId) setCurrentVoucherId(signlessVoucherId[0]);

      } catch (e) {
        alert.error('Error while setting signless account voucher id');
      }

      resolve();
    });
  }







  

  


  const signer1 = async () => {
    
    if (!accounts||!api) {
      console.log('Accounts is not ready!');
      return;
    }

    setUserFillingTheForm(true);

    const localaccount = account?.address;
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount) {
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(message, metadata);

      const injector = await web3FromSource(accounts[0].meta.source);

      transferExtrinsic
        .signAndSend(
          account?.address ?? alert.error("WEB3: No account"),
          { signer: injector.signer },
          ({ status }) => {
            if (status.isInBlock) {
              alert.success(status.asInBlock.toString());
              
              
            } else {
                console.log("WEB3: In process GREEN");
              if (status.type === "Finalized") {
                alert.success(status.type);
                
                

              }
            }
          }
        )
        .catch((error: any) => {
          console.log("WEB3:  :( transaction failed", error);
          
          
        });
    } else {
      alert.error("WEB3: Account not available to sign");
      setButtonMsg("Click again: Account not available to sign")
    }
  };











  return (
    <>
      { 
        userFillingTheForm &&
        <SignlessForm 
          close={() => setUserFillingTheForm(false)}
        />
      }
      <Button 
        backgroundColor="gray.400" 
        // onClick={signer} 
        onClick={handleClick}
        isLoading={loadingButton}
        isDisabled={disableButton}
      > 
        {buttonMsg} 
      </Button>
    </>
  );
}



export { AcceptEndButton };

 
    
    