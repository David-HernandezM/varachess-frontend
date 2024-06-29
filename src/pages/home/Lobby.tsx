import React, { useState } from 'react';
import { useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,

} from '@chakra-ui/react'

interface LobbyProps {
    parentSelectGame: (arg1: string) => void;
}



const Lobby:React.FC<LobbyProps> = ({ parentSelectGame}) => {
    const [games, setGames] = useState([[]]);
    useEffect( () => {
        const interval = setInterval(() => {
            fetch(`https://vchess.pythonanywhere.com/currentgames`)
            .then(response => response.json())
            .then(data => {
                console.log("CURRENTGAMES: ");
                console.log(data)
                
                if (Array.isArray(data[0])) {
                    setGames( data )
                } else {
                    setGames( [data] ) //debe estar como arreglo de arreglos
                }

                    
                
            })
            .catch(error => console.error(error));
        }, 2000);
    return () => clearInterval(interval);
    }, [])

    const disableButton = (val: string):boolean => {
        console.log("hey I want to disable this thing... heres what i got " + val)
        if (val === "AVAILABLE"){
            console.log("going to send false");
            return false;
        }else {
            console.log("going to send TRUE");
            return true;
        }
    }
    return (
        <>
        <h1> Visit other games and place your bets!!  </h1>
        
        <TableContainer>
            <Table variant='simple'>
            <TableCaption> </TableCaption>
                <Thead>
                    <Tr>
                        <Th>Games ID</Th>
                        <Th>Player 1 </Th>
                        <Th>Player 2 </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {games.map((item) =>  ( 
                        <Tr>
                        <Td > <Button onClick={() => parentSelectGame(item[0])} > {item[0]}   </Button> </Td>
                        <Td>{item[10]}</Td>
                        <Td>{item[11]}</Td>
                        </Tr>
                    ))}
                    
                    
                </Tbody>
                
            </Table>
        </TableContainer>
        </>
    )
}

export {Lobby};