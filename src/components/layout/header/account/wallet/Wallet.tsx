import { Account } from '@gear-js/react-hooks';
import { AccountButton } from '../account-button';
import styles from './Wallet.module.scss';
import { Address } from 'viem';

type Props = {
  balance: Account['balance'];
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function Wallet({ balance, address, name, onClick }: Props) {  

  
  const newAddress = address as Address;

  return (
    <div className={styles.wallet}>
      <p className={styles.balance}>
        {balance.value} <span className={styles.currency}>{balance.unit} / { newAddress} </span>
      </p>
      <AccountButton address={address} name={name} onClick={onClick} />
    </div>
  );
}

export { Wallet };
