import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);


const LogoutPane = () => {
  const wantToLogOff = () => {
    localStorage.setItem("logged", "false");
  
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    console.log("want to log off")
    fetch(`http://localhost:5000/logoutplayer?email=${email}&password=${password}`)
                .then(response => response.json())
                .then(data => {
                                console.log(data)
                                }
                            )
                .catch(error => console.error(error));
    localStorage.setItem("email", "");
    localStorage.setItem("password", "");
    localStorage.setItem("nickname", "") ;
    localStorage.setItem("name", "") ;
  }
  return(
    <Button
    borderRadius={0}
    
    variant="solid"
    colorScheme="teal"
    width="full"

    onClick={wantToLogOff}
  >
    Log off
  </Button>
  )
}


const LoginDialog = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [logged, setLogged] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleShowClick = () => setShowPassword(!showPassword);


  const wantToLogin = () => {
    
    console.log("So you want to login..." + email + " pass: " + password);

    fetch(`http://localhost:5000/login?email=${email}&password=${password}`)
                .then(response => response.json())
                .then(data => {
                                console.log(data)
                                console.log( "The user can be logged? " + data.logged)
                                if (Boolean( data.logged ) === true ){
                                  console.log("YOu are LOGGED IN");
                                  localStorage.setItem("email", email);
                                  localStorage.setItem("password", password);
                                  localStorage.setItem("logged", "true");
                                  localStorage.setItem("nickname", data.nickname) ;
                                  localStorage.setItem("name", data.name) ;
                                  console.log("verifying the info: " +  localStorage.getItem("email")  );
                                  setLogged(true);

                                  
                            
                                }
                            })
                .catch(error => console.error(error));

  }



  return(
    <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar bg="teal.500" />
          <Heading color="teal.400">Welcome</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            
  
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
                color='black'
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input type="email" placeholder="email address" name='email'
                      onChange={e => setEmail(e.target.value)} value={email} 
                      />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="black"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name='password'
                      onChange={e => setPassword(e.target.value)} value={password} 
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText textAlign="right">
                    <Link>forgot password?</Link>
                  </FormHelperText>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
  
                  onClick={wantToLogin}
                >
                  Login
                </Button>
              </Stack>
          </Box>
        </Stack>
        <Box>
          New to us?{" "}
          <Link color="teal.500" href="#">
            Sign Up
          </Link>
        </Box>
      </Flex>
  )
}


// { localStorage.getItem("logged") == 'true' ?  <LogoutPane /> : <LoginDialog /> }
const Loginpage = () => {

  const [logged, setLogged] = useState(localStorage.getItem("logged") );

  useEffect( () => {
    console.log("WELCOME, this is the user data" + localStorage.getItem("email") );
    

    const interval = setInterval(() => {
      setLogged( localStorage.getItem("logged") );
    }, 1000);


  }, []);

  
  
    return (  
      <>    
      
      <p>OK you are logged in </p>

      <p> then to leave: </p>
      { logged  == 'false' &&   <LoginDialog /> }
      
      { logged == 'true' &&   <LogoutPane /> }
      
      </>
    )
  }


export default Loginpage;
