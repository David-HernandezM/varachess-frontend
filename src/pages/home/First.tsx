import { GearApi } from '@gear-js/api';
import {Text, Box} from '@chakra-ui/react';
import React, {useState} from 'react';
import { redirect } from 'react-router-dom';

function First(){
    const [output, setOutput] = useState("");
    const [output2, setOutput2] = useState("");

    async function connect() {
        const gearApi = await GearApi.create({
          providerAddress: 'wss://testnet.vara-network.io',
        });
      
        const [chain, nodeName, nodeVersion] = await Promise.all([
          gearApi.chain(),
          gearApi.nodeName(),
          gearApi.nodeVersion(),
        ]);
      
        setOutput(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

        console.log(
          `${output}`,
        );
      
        const unsub = await gearApi.gearEvents.subscribeToNewBlocks((header) => {
            setOutput2("u");
          console.log(
            `${output2}`,
          );
        });
      }
      
      connect().catch(console.error);

      return (
        <>
        <Text> Hola info: {output}  </Text>
        <Box boxShadow='dark-lg' p='6' rounded='md' bg="gray" m='5' mb='5' >
            {output2}
        </Box>
        </>
      );

}

export { First };