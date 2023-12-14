import { ProgramMetadata } from "@gear-js/api";
import { useState } from "react";
import { useApi, useAlert } from "@gear-js/react-hooks";
import { Box, Button, Card, Center, Heading, VStack, Text } from "@chakra-ui/react";

function PongState() {
  const { api } = useApi();

  const alert = useAlert();

  const [fullState, setFullState] = useState<any | undefined>(0);

  const igot = (fullState[0] && fullState[0][1]) ?? "Black";
  console.log(igot);
  // Add your programID
  const programIDFT =
  "0x4339198550ae8d7761a30c00dc0491eb2a6cb9cec9e5404ac4bdaee5dc78b9ba";

  // Add your metadata.txt
  const meta =
  "000200000001000000000100000000000000000001010000003408000000050200040000020000";



  const metadata = ProgramMetadata.from(meta);

  const getState = () => {
    api.programState
      .read({ programId: programIDFT, payload: "PING" }, metadata)
      .then((result) => {
        console.log(result);
        setFullState(result);
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  getState();
  console.log(fullState);

  return (
    <Card   w='100%' h='100%' bgGradient="radial(#000000 , #111111)" >
      <Center>
        <VStack  >
          <Heading  m='5' color='white' >Stop light state:</Heading>
          <Button
            m='5'
            borderRadius="50px"
            w="100px"
            h="100px"
            backgroundColor="white"
            
          >
            {igot}
          </Button>

          
          <Box boxShadow='dark-lg' p='6' rounded='md' bg='white' m='5' mb='5' >
          <Heading  color='black' >State Contract</Heading>
          <Text   >{JSON.stringify(fullState)}</Text>
          </Box>
          

          
        </VStack>
      </Center>
    </Card>
  );
}

export { PongState };
