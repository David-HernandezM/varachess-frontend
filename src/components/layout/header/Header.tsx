
import { Link as ReactRouterLink } from 'react-router-dom';



import { Link as ChakraLink, LinkProps, Box, Center, Spacer, Flex, Text, defineStyle, defineStyleConfig  } from '@chakra-ui/react';




import { Account } from './account';
import styles from './Header.module.scss';
import loguito from './logo-white.svg';
import varachesslogo from './varachess2.png';


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
  return (
    <header className={styles.header}>
      <img src={varachesslogo} className={styles.varalogocentered} alt="LOGO VARA CHESS CENTERED" />
      <Box boxShadow='dark-lg'  p={4} pb={4} mb={10} w='100%' h='100%' bgGradient='linear(to-l, #bbbbbb, #aaaaaa)' >
        <Flex>

          <Center>
            <img src={varachesslogo} className={styles.varalogo} alt="LOGO VARA CHESS" />
          </Center>
          <Center w="80px">
          <div className={styles.mytext} > VARACHESS </div>
          </Center>
         


          <Spacer />
          {isAccountVisible && <Account />}


        </Flex>


      </Box>
      
    </header>

  );
}

export { Header };

