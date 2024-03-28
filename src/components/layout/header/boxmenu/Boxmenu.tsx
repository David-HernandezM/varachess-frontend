import './Boxmenu.css';
import {
    ChakraProvider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Box,
    Center,
    Link as ChakraLink, 
    LinkProps,
  } from '@chakra-ui/react';


import theme from './theme';

import { Link as ReactRouterLink } from 'react-router-dom';

function Boxmenu() {
    return (
        <ChakraProvider theme={theme}>
        <Box position="relative">
          <Center>
            <Menu variant="roundLeft">
              <MenuButton>HOME</MenuButton>
              <MenuList>
                <MenuItem >
                <ChakraLink as={ReactRouterLink} to='/Home'>
                News and Updates
              </ChakraLink>
                
                </MenuItem>
                <MenuItem >About VARA</MenuItem>
                
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton>PLAY NOW</MenuButton>
              <MenuList>
                <MenuItem ><ChakraLink as={ReactRouterLink} to='/game'>
                Go to game
              </ChakraLink>
              </MenuItem>
                <MenuItem >Tournament</MenuItem>
                <MenuItem >VS. BOT</MenuItem>
                
              </MenuList>
            </Menu>
            <Menu >
              <MenuButton>MY PROFILE</MenuButton>
              <MenuList> 
                <MenuItem >  
                    <ChakraLink as={ReactRouterLink} to='/profile'>
                    Profile
                    </ChakraLink> 
                </MenuItem>
                <MenuItem >My pieces </MenuItem>
                
              </MenuList>
            </Menu>

       
            
          </Center>
        </Box>
      </ChakraProvider>
        ); 
}

export  {Boxmenu};

