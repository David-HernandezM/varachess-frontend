
import React, { FC, ReactNode, SyntheticEvent } from "react";

import { ChessGame } from "./ChessGame";
import { PlayButton } from "./PlayButton";
import { EndButton } from "./EndButton";
import { HStack, VStack} from "@chakra-ui/react";
import { GameProcess } from "./GameProcess";

//  <ChessGame />

function Game() {

  return (
    <>
      
      <VStack>
        <GameProcess />

     
      
        <HStack>
          <PlayButton />
          <EndButton />
        </HStack>
      </VStack>

    </>

  );
}

export { Game };
