import { Wallet } from './wallet';
import { AccountsModal } from './accounts-modal';
import { useApi, useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { useState, useEffect } from 'react';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util'

export function AccountInfo() {
  const { isApiReady } = useApi();
  const { account, accounts } = useAccount();
  const { balance } = useBalance(account?.address);
  const { getFormattedBalance } = useBalanceFormat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance) : undefined;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    
    console.log("Hi this is the wallet")
    
    const keyring = new Keyring();
    
    const interval = setInterval(() => {
      if( "namewallet" in localStorage){

        const publicAddress = keyring.decodeAddress(localStorage.account)
        const hexAddress = u8aToHex(publicAddress)

        console.log("Im checking it out now " + localStorage.namewallet + " with account: " + localStorage.account + " HEXX: " + hexAddress );
        fetch(`http://localhost:5000/loginplayer?name=${localStorage.namewallet}&account=${localStorage.account}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log("This is the result of calling loginplayer:" + JSON.stringify(data));
                    localStorage.playerID = data.status;
                    console.log("localSotrage.playerID = " + localStorage.playerID)

                  })
                  .catch(error => console.error(error));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      {account ? (
        <Wallet balance={formattedBalance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <Button  text="Sign in" onClick={openModal} />
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}


// return (
  //   <>
  //     <div className={clsx(styles.wrapper, className)}>
  //       {!!account && (
  //         <>
  //           {formattedBalance && (
  //             <VaraBalance value={formattedBalance.value} unit={formattedBalance.unit} className={styles.balance} />
  //           )}

  //           <Button variant="text" className={styles.openWallet} onClick={openWallet}>
  //             {isOpen ? (
  //               <CrossIcon />
  //             ) : (
  //               <>
  //                 <AvaVaraBlack width={24} height={24} />
  //                 <ChevronDown />
  //               </>
  //             )}
  //           </Button>
  //         </>
  //       )}
  //     </div>
  //   </>
  // );