import { Box, HStack, VStack, Center, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { GreenButton } from "./GreenButton";
import { YellowButton } from "./YellowButton";
import { RedButton } from "./RedButton";
import { ReadState } from "./ReadState";
import { MenuColors } from "./MenuColors";
import { GasData } from "./GasData";

import { PingButton } from "./PingButton";
import { PongState } from "./PongState";


function Home() {


  return (
    

      <Tabs>
        <TabList>
          <Tab>Stop Light</Tab>
          <Tab>Subscribe and get Chain Spec</Tab>
          <Tab>Two</Tab>
          
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box background="black" >
              <HStack >

                <VStack pl="2" spacing="20px" align="center">

                  <GreenButton />
                  <YellowButton />
                  <RedButton />


                </VStack>


                <ReadState />


              </HStack>
            </Box>

            <HStack>
              <MenuColors />
            </HStack>



          </TabPanel>
          <TabPanel>
          <h1> This is First </h1>
            

          </TabPanel>
          <TabPanel>
            <p>two!</p>
            <GasData />
            <PingButton />
            <PongState />

          </TabPanel>
        </TabPanels>
      </Tabs>


  );
}

export { Home };
