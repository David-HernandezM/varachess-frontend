
import { Link as ReactRouterLink } from 'react-router-dom';



import { Link as ChakraLink, LinkProps, Box, Center, Spacer, Flex, Text, defineStyle, defineStyleConfig  } from '@chakra-ui/react';




import { Account } from './account';
import { Boxmenu } from './boxmenu';

import styles from './Header.module.scss';
import loguito from './logo-white.svg';
import varachesslogo from './logo_official.jpeg';



const brandPrimary = defineStyle({
  textDecoration: 'underline',
  color: 'red',
  fontFamily: 'serif',
  fontWeight: 'normal',

  // let's also provide dark mode alternatives
  _dark: {
    color: 'orange.800',
  }
})

export const linkTheme = defineStyleConfig({
  variants: { brandPrimary },
})




type Props = {
  isAccountVisible: boolean;
};

function Header({ isAccountVisible }: Props) {

  function Logged(){
         return (
        <span className={styles.mytext}> 
        {Boolean(localStorage.getItem('logged')) &&  localStorage.getItem('nickname') } 
        
        </span>
      )
    
  }
  return (
    <div className={styles.header}>
      
      <div className={styles.logosection} >
        <img src={varachesslogo} className={styles.varalogo} alt="LOGO VARA CHESS" />
         
        
      </div>
      
      <div className={styles.rightMenus}>
        
      <Boxmenu /> 
      
      <Logged />
      
        {isAccountVisible && <Account />}
      </div>
      
    </div>

  );
}

export { Header };

