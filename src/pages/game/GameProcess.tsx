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
    const [players, setPlayers] = useState<string[][]>([]);
    
    useEffect(() => { 
        const interval = setInterval(() => {
            fetch(`http://localhost:5000/listplayers`)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Called the list of players")
                        console.log(data);
                        // quitarme a mi mismo...
                        let listPlayers: string[][] = [];
                        data.forEach( (elem: string[])  => {
                            if( elem[0] !== localStorage.namewallet ){
                                listPlayers.push(elem )
                            }
                        });
                        setPlayers(listPlayers);
                    })
                    .catch(error => console.error(error));
                }, 5000);
            return () => clearInterval(interval);
    }, [])

    const selectPlayer = (player: string, player_id: string) => {
        console.log("You are selecting a player " + player + " with ID: " + player_id)
        fetch(`http://localhost:5000/invite?player_id_from=${player}&player_id_to=${player_id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Invitation status: ");
            console.log(data)
        })
        .catch(error => console.error(error));
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
                            <Td > <Button  onClick={() => selectPlayer(item[0], item[2])} > {item[0]} </Button> </Td>
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