import { Center, HStack, VStack } from "@chakra-ui/react";
import { GreenColor } from "./Green-Color";
import { RedColor } from "./Red-Color";
import { YellowColor } from "./Yellow-Color";
import { ReadState } from "./ReadState";
import { GameProcess } from "./GameProcess";

function Home() {
  return (
    <Center>
      <HStack>
        <VStack>
          <GameProcess />
          
        </VStack>
        
      </HStack>
    </Center>
  );
}

export { Home };
