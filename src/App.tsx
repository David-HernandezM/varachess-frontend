import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, ApiLoader, Footer } from 'components';
import { withProviders } from 'hocs';
import './App.css';
import { Link as ReactRouterLink } from 'react-router-dom';

import { Link as ChakraLink, VStack, Flex, Box, Spacer, HStack, Center } from '@chakra-ui/react';
import styles from './components/layout/header/Header.module.scss';

import iconProfile from './assets/images/icons/profile.png';
import iconTournaments from './assets/images/icons/tournaments.png';
import iconNews from './assets/images/icons/news.png';
import iconLeader from './assets/images/icons/leaderboard.png';
import iconFriends from './assets/images/icons/friends.png';
import iconMarket from './assets/images/icons/marketplace.png';
import iconLearn from './assets/images/icons/learn.png';
import iconPuzzle from './assets/images/icons/puzzle.png';
import iconMyPieces from './assets/images/icons/mypieces.png';
import iconSettings from './assets/images/icons/settings.png';



function Component() {
 
  
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const isAppReady = isApiReady && isAccountReady;

 

  return (

    <Box paddingTop='100px'>


      <Header isAccountVisible={isAccountReady} />

      <Center>
        <Box w="50%" borderRadius='20px' bg='linear-gradient( #222222 , #000000)' shadow='10px 10px 10px #000000' fontFamily='rangver' color='beige' p='10px'>
          <Center>
           <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
          </Center>
        </Box>
      </Center>


    </Box>

  );
}

export const App = withProviders(Component);
