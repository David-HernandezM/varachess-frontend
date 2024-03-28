import { useState } from 'react';
import { useEffect } from 'react';

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
} from '@chakra-ui/react'

const GameProcess = () => {
    //const players = [ ['Jovana', 99], ['Lulu', 888], ['Molly', 54] ]
    const [players, setPlayers] = useState<string[][]>([]);
    
    useEffect(() => { 
        fetch(`http://localhost:5000/listplayers`)
                .then(response => response.json())
                .then(data => {
                    console.log("Called the list of players")
                    console.log(data);
                    setPlayers(data);
                })
                .catch(error => console.error(error));

    }, [])

    const selectPlayer = (player: string) => {
        console.log("You are selecting a player " + player)
    }

    return (
        <>
            <h3> These are the available players: </h3>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Players</Th>
                            <Th>EXP</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {players.map((item, index) =>  ( 
                            <Tr>
                            <Td > <Button onClick={() => selectPlayer(item[1])}> {item[1]} </Button> </Td>
                            <Td>{item[2]}</Td>
                            </Tr>
                        ))}
                        
                        
                    </Tbody>
                    
                </Table>
            </TableContainer>
        </>
    );
}

export { GameProcess };