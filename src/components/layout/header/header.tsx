import React from 'react';
import { Logo } from './logo';
import { AccountInfo } from './account-info';
import { useAppSelector } from '@/app/hooks';
import { ToggleSwitchAccounts } from '@/components/ToggleSwitchAccounts/ToggleSwitchAccounts';
import { ToggleSwitchGasless } from '@/components/ToggleSwitchGasless/ToggleSwitchGasless';
import styles from './header.module.scss';

type Props = {
  isAccountVisible: boolean;
};

export function Header({ isAccountVisible }: Props) {
  const x = useAppSelector((state) => state.AccountsSettings.polkadotEnable);

  return (
    <header className={styles.header}>
      <Logo />
      
      <div className={styles.optionsContainer}>
        <ToggleSwitchGasless />
        <ToggleSwitchAccounts />
        {isAccountVisible && <AccountInfo />}
      </div>
    </header>
  );

  
}
