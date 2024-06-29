import React, { useState } from 'react';
import { Select, 
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
} from '@chakra-ui/react'

  
// import { ChevronDownIcon } from '@chakra-ui/icons'
  interface ViewerBetsProps {
    playerWhiteName:string;
    whitePlayerId:string;
    blackPlayerId:string;
    playerBlackName:string;
    //parentPlacedBet: (arg1: string) => void;
  }

  const ViewerBets:React.FC<ViewerBetsProps> = ({playerWhiteName, whitePlayerId, blackPlayerId,  playerBlackName}) => {
    return (
        <>
       Place your bet on this player
      <Select  placeholder='Place your bet on this player'>
  <option value='option1' style={{color:'black' }}>{playerWhiteName}</option>
  <option value='option2' style={{color:'black' }}>{playerBlackName}</option>
        </Select>


        This is your bet (TVARA):
  <NumberInput defaultValue={5} min={1} max={20000}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

<Button colorScheme='purple' >
    Place your Bet!!
  </Button>
  

        </>
    )
  }

  export {ViewerBets};

