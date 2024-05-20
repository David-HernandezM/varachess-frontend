import { ProgramMetadata } from "@gear-js/api";
import { useState } from "react";
import { useApi, useAlert } from "@gear-js/react-hooks";
import { Button, Card, Center, Heading, VStack, Text } from "@chakra-ui/react";

function ReadState() {
  const { api } = useApi();

  const alert = useAlert();

  const [fullState, setFullState] = useState<any | undefined>(0);


  const color = (fullState.currentLight) ?? "Black";

   // Add your programID
   const programIDFT =
   "0x258790299f7ba02baf5238dcf203e8c0eae4cac0a7fae02f5d1b31a55b46b686"

 // Add your metadata.txt
 const meta =
   "00020000000100000000010800000000000000000109000000710a340008307661726163686573735f696f3843686573734d657373616765496e00010c385265717565737442616c616e6365040004010c7536340000004052657175657374537461727447616d6504000801405265717565737447616d6553746172740001001c456e6447616d65040018011c47616d65456e64000200000400000506000808307661726163686573735f696f405265717565737447616d65537461727400000c011c67616d655f696404010c753634000128706c617965725f62657404010c753634000118706c617965720c011c4163746f72496400000c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001001205b75383b2033325d0000100000032000000014001400000503001808307661726163686573735f696f1c47616d65456e64000008011c67616d655f696404010c75363400012c726573756c745f67616d651c0124526573756c74456e6400001c08307661726163686573735f696f24526573756c74456e6400010c0c57696e000000104c6f73650001001044726177000200002000000502002408307661726163686573735f696f2843686573735374617465000004011467616d65732801405665633c47616d65537461727465643e0000280000022c002c08307661726163686573735f696f2c47616d6553746172746564000014011c67616d655f696404010c75363400012067616d655f62657404010c75363400013067616d655f706c61796572310c011c4163746f72496400013067616d655f706c61796572320c011c4163746f72496400012c67616d655f73746174757330012853746174757347616d6500003008307661726163686573735f696f2853746174757347616d650001081c5374617274656400000014456e64656400010000"

  const metadata = ProgramMetadata.from(meta);

  const getState = () => {
    api.programState
      .read({ programId: programIDFT}, metadata)
      .then((result) => {
       console.log("I got something from getState"); 
	const games = result.games;
	games.forEach( (v)=>{
		
       		console.log("--> " + v.gameId); 
		if( v.gameId == 112211 ) {
			setFullState( v.gameStatus  );			
		}
	});
	
	
        console.log(fullState);
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  getState();

  return (
    <Card>
      <Center>
        <VStack>
          <Heading>Traffic-light</Heading>
          <Button
            borderRadius="50px"
            w="400px"
            h="400px"
            backgroundColor={color ?? "black"}
          >
            Light
          </Button>

          <Heading>State Contract</Heading>
          <Text>{JSON.stringify(fullState)}</Text>
        </VStack>
      </Center>
    </Card>
  );
}

export { ReadState };
