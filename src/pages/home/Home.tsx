import { Box, HStack, VStack, Center, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { GreenButton } from "./GreenButton";
import { YellowButton } from "./YellowButton";
import { RedButton } from "./RedButton";
import { ReadState } from "./ReadState";
import { MenuColors } from "./MenuColors";
import { GasData } from "./GasData";

import { PingButton } from "./PingButton";
import { PongState } from "./PongState";

import {useState, useEffect} from 'react'


//const POST_API = "https://jsonplaceholder.typicode.com/posts";

const POST_API = "http://localhost:5000/test";

const ERROR_MSG = "Oops! Something went wrong 🤷‍♂️";

interface FetchData {
  url: string;
  options?: RequestInit;
}

const fetchData = async function ({ url, options }: FetchData): Promise<any> {
  const response = await fetch(url, options);

  if (!response.ok) {
      throw new Error(ERROR_MSG);
  }

  const data = await response.json();
  return data;
};

const someObj = {
  player_id: 'foo',
  player_color: 'bar',

};

const processApiRequests = async function (anObj: any) {

    const options: RequestInit = {
        method: "POST",
        body: JSON.stringify(anObj),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        }
    };

    // Submit and return a POST Request to the API with options
    return await fetchData({ url: POST_API, options });
};


function Home() {
  const [myData, setMyData] = useState('undefined');

  useEffect(() => {
    // Process API requests and data manipulation
    //fetch('https://api.npms.io/v2/search?q=react')
    fetch('http://localhost:5000/test_get?player_id=999&player_color=green')
        .then(response => response.json())
        .then(data => {
            //setIsLoading(false);
            //setState(data);
            console.log("This is the data: ")
            console.log(data);
            setMyData(JSON.stringify(data));

        })
        .catch(e => console.log(e.message));

}, []);

  const NewsItem = () => {
    return (
      <Box border='2px' borderRadius='10px' p='10px'>
        <HStack>
          <Box w='200px' h='200px' bg='linear-gradient(teal,RebeccaPurple)' borderTopLeftRadius='10px' borderBottomLeftRadius='10px' 
                textAlign='center' alignContent='center'>
          </Box>
          <Box w='600px'>
            INFO GOES HERE: {myData}
          </Box>
        </HStack>
      </Box>
    )
  }

  return (
  <VStack>


  <h1> News and Updates   </h1>
    <NewsItem />
    <NewsItem />
    <NewsItem />
    
  </VStack>
  );
}

export { Home };
