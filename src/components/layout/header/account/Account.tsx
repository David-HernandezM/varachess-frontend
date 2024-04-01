import { useState, useEffect } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { AccountsModal } from './accounts-modal';
import { Wallet } from './wallet';

function Account() {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    console.log("Hey what's going on??");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    
    console.log("Hi this is the wallet")
    

    
    const interval = setInterval(() => {
      if( "namewallet" in localStorage){

        console.log("Im checking it out now " + localStorage.namewallet + " with account: " + localStorage.account );
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
        <Wallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <button type="button" onClick={openModal}> Connect Your Wallet</button>
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}

export { Account };
