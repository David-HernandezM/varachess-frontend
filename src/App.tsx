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

  // Easiest way to declare a Function Component; return type is inferred.


  return (

    <Box>


      <Header isAccountVisible={isAccountReady} />

      <Flex>
        <Spacer />
        <Box w="20%" bg='gray' paddingTop='5' paddingBottom='5'>

          <HStack>
            <span className='dot'><img src={iconProfile} className='iconimg' alt='Profile' /> </span>
            <div className={styles.mytext} >
              <ChakraLink as={ReactRouterLink} to='/profile'>
                Profile
              </ChakraLink>
            </div>

          </HStack>

          <HStack>
            <span className='dot'><img src={iconTournaments} className='iconimg' alt='Tournaments' /> </span>
            <div className={styles.mytext} >
              <ChakraLink as={ReactRouterLink} to='/game'>
                Tournaments
              </ChakraLink>
            </div>

          </HStack>

          <Spacer />

          <HStack>
            <span className='dot'><img src={iconNews} className='iconimg' alt='News' /> </span>
            <div className={styles.mytext} >
              <ChakraLink as={ReactRouterLink} to='/about'>
                News and Updates              </ChakraLink>
            </div>

          </HStack>

          <HStack>
            <span className='dot'><img src={iconLeader} className='iconimg' alt='Leaderboard icon' /> </span>
            <div className={styles.mytext} >
              <ChakraLink as={ReactRouterLink} to='/home'>
                Leaderboard             </ChakraLink>
            </div>

          </HStack>


          <ChakraLink as={ReactRouterLink} to='/home'>
            <HStack>
              <span className='dot'><img src={iconFriends} className='iconimg' alt='Friends icon' /> </span>
              <div className={styles.mytext} >

                Friends
              </div>
            </HStack>
          </ChakraLink>




        </Box>
        <Spacer />
        <Box w="50%" bg='gray'>
          <Center>
           <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
          </Center>
        </Box>

        <Spacer />
        <Box w="20%" bg='gray' paddingTop='5' paddingBottom='5'>
          <ChakraLink as={ReactRouterLink} to='/faq'>
            <HStack >
              <div className={styles.mytext2} >

                Marketplace
              </div>
              <Spacer />

              <span className='dot2'><img src={iconMarket} className='iconimg' alt='Marketplace icon' /> </span>

            </HStack>
          </ChakraLink>


          <ChakraLink as={ReactRouterLink} to='/faq'>
            <HStack >
              <div className={styles.mytext2} >

                Learn
              </div>
              <Spacer />
              <span className='dot2'><img src={iconLearn} className='iconimg' alt='Learn icon' /> </span>

            </HStack>
          </ChakraLink>

          <ChakraLink as={ReactRouterLink} to='/faq'>
            <HStack >
              <div className={styles.mytext2} >

                Puzzle
              </div>
              <Spacer />
              <span className='dot2'><img src={iconPuzzle} className='iconimg' alt='Puzzle icon' /> </span>

            </HStack>
          </ChakraLink>

          <ChakraLink as={ReactRouterLink} to='/faq'>
            <HStack >
              <div className={styles.mytext2} >

                My Pieces
              </div>
              <Spacer />
              <span className='dot2'><img src={iconMyPieces} className='iconimg' alt='Puzzle icon' /> </span>

            </HStack>
          </ChakraLink>

          <ChakraLink as={ReactRouterLink} to='/faq'>
            <HStack >
              <div className={styles.mytext2} >

                Settings
              </div>
              <Spacer />
              <span className='dot2'><img src={iconSettings} className='iconimg' alt='Puzzle icon' /> </span>

            </HStack>
          </ChakraLink>

        </Box>
        <Spacer />
      </Flex>


    </Box>

  );
}

export const App = withProviders(Component);
