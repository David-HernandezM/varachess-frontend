import { ProgramMetadata } from "@gear-js/api";
import { useState } from "react";
import { useApi, useAlert } from "@gear-js/react-hooks";
import { Box, Button, Card, Center, Heading, VStack, Text } from "@chakra-ui/react";

function ReadState() {
  const { api } = useApi();

  const alert = useAlert();

  const [fullState, setFullState] = useState<any | undefined>(0);

  const color = (fullState[0] && fullState[0][1]) ?? "Black";

  // Add your programID
  const programIDFT =
  "0x852860d732de28c766d024adbd08cba2bec2be69b884b6a8aa85636bfb45b587";

  // Add your metadata.txt
  const meta =
  "000100000001000000000101000000000000000102000000090320000808696f48416374696f6e547261666669634c6967687400010c14477265656e0000001859656c6c6f770001000c52656400020000040808696f444576656e74547261666669634c6967687400010c14477265656e0000001859656c6c6f770001000c52656400020000080000020c000c00000408101c001010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001401205b75383b2033325d0000140000032000000018001800000503001c0000050200";



  const metadata = ProgramMetadata.from(meta);

  const getState = () => {
    api.programState
      .read({ programId: programIDFT, payload: "" }, metadata)
      .then((result) => {
        setFullState(result.toJSON());
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  getState();

  return (
    <Card   w='100%' h='100%' bgGradient={`radial(${color} , #111111)`} rounded ='full'>
      <Center>
        <VStack  >
          <Heading  m='5' color='white' >Stop light state:</Heading>
          <Button
            m='5'
            borderRadius="50px"
            w="100px"
            h="100px"
            backgroundColor={color ?? "black"}
            shadow={color}
          >
            {color}
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

export { ReadState };
