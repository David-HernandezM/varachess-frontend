import { Link as ChakraLink, VStack, Flex, Box, Spacer, HStack, Center, Button } from '@chakra-ui/react';

import Loginpage  from './Loginpage';

function Profile() {
  
  const Register = () => {
    return(
        <p> Register </p>
    );
  }

  

  return (
    <>
    <h1>Register</h1>

    <Loginpage />

    <Register />
    </>
  );
}

export { Profile };
