import { useState } from 'react';
import { useEffect } from 'react';
import { ChessGame } from "./ChessGame";
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

interface PropsMySentInvitations {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string) => void

}

const MySentInvitations: React.FC<PropsMySentInvitations>  = ( {sendDataToParent} ) => {
    const [myArray, setMyArray] = useState<string[][]>([]);
    useEffect( () => {
        const interval = setInterval(() => {
            fetch(`http://localhost:5000/mysentinvitations/${localStorage.playerID}`)
            .then(response => response.json())
            .then(data => {
                console.log("MY INVITATIONS: ");
                console.log(data)
                setMyArray(data);
                if( data.length > 0){
                    data.forEach( (r:string) => {
                        if( r[5] == 'ACCEPTED' ) {
                            console.log("~~~~The game has been accepted!!!");
                            sendDataToParent(r[6], r[1], r[7], r[8],r[9])
                        }
                   })
                }
                

                
            })
            .catch(error => console.error(error));
        }, 500);
    return () => clearInterval(interval);
    }, [])
    return (
        <>
        <h3> These are the sent invitations </h3>
        {myArray.map((item, index) =>  ( 
            <p> {item[0]} {item[1]} {item[2]} {item[3]}  {item[4]} {item[5]} {item[6]} {item[7]} </p> 
        ))}
        </>
    )
}


interface Props {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string) => void
    player_id_from: string;
    player_name_from: string;
    player_id_white: string;
    player_id_black: string;

  }
  const AcceptButton: React.FC<Props> = ({sendDataToParent, player_id_from, player_name_from, player_id_white, player_id_black}) => {
    const [gameid, setGameId] = useState<number>(0);
    const acceptInvitation = () => {
        console.log("You want to accept the invitation from  " + player_name_from)


        fetch(`http://localhost:5000/acceptdeclineinvitation/${localStorage.playerID}/${player_id_from}/1`)
        .then(response => response.json())
        .then(data => {
            console.log("You tried to accept invitation, here is response: ");
            console.log(data);
            setGameId(data)
            sendDataToParent(data, player_id_from, player_name_from,player_id_white, player_id_black )

        })
        .catch(error => console.error(error));
    }

    return (
        <Button onClick={acceptInvitation}>{player_name_from} / {player_id_from} </Button>

    );
  };

  interface IsecondChildProps {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string) => void
  
  }

const MyInvitations: React.FC<IsecondChildProps> = ({sendDataToParent}) => {
    const [myArray, setMyArray] = useState<string[][]>([]);
    useEffect( () => {
        const interval = setInterval(() => {
        
            fetch(`http://localhost:5000/myinvitations/${localStorage.playerID}`)
            .then(response => response.json())
            .then(data => {
                console.log("I AM BEEING INVITED TO: ");
                console.log(data)
                setMyArray(data);

                
            })
            .catch(error => console.error(error));
        }, 5000);
        return () => clearInterval(interval);
    }, [])
    

    return (
        <>
        <h3> I AM BEEING INVITED TO:</h3>
        {myArray.map((item, index) =>  ( 
            <p>GAME_ID: {item[4]} {item[0]} {item[1]} {item[2]} {item[5]}  {item[6]} 
            <AcceptButton  sendDataToParent={sendDataToParent} player_id_from={item[1]} 
                        player_name_from={item[0]} player_id_white={item[5]} player_id_black={item[6]}/> </p>
        ))}
        <button onClick={() => sendDataToParent('', '', '', '', '')} > JUST UPDATE PARRENT </button>
        </>
    )
}


const GameProcess = () => {
    const [players, setPlayers] = useState<string[][]>([]);
    const [invitationProgress, setInvitationProgress] = useState<number>(0);
    const [gameId, setGameId] = useState("");
    const [otherPlayerId, setOtherPlayerId] = useState("");
    const [otherPlayerName, setOtherPlayerName] = useState("");
    const [whitePlayerId, setWhitePlayerId] = useState("");
    const [blackPlayerId, setBlackPlayerId] = useState("");



    const handleDataFromChild = (gameId: string, otherPlayerId: string, otherPlayerName: string,
                                whitePlayerId: string, blackPlayerId: string):void => {
        setGameId(gameId);
        setOtherPlayerId(otherPlayerId);
        setOtherPlayerName(otherPlayerName);
        setWhitePlayerId(whitePlayerId);
        setBlackPlayerId(blackPlayerId);
    }

    

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

    const selectPlayer = (player_id: string) => {
        console.log("You have player ID" + localStorage.playerID + " with ID: " + player_id)
        fetch(`http://localhost:5000/invite?player_id_from=${localStorage.playerID}&player_id_to=${player_id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Invitation status: ");
            console.log(data)
            if (data.status===true){
                console.log("invitation sent successfuly ");
                setInvitationProgress(1);
            } else {
                setInvitationProgress(-1);
            }
        })
        .catch(error => console.error(error));
    }

    const ShowAvailablePlayers = () => {
        return (
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
                            <Td > <Button  onClick={() => selectPlayer(item[2])} > {item[0]} </Button> </Td>
                            <Td>{item[2]}</Td>
                            </Tr>
                        ))}
                        
                        
                    </Tbody>
                    
                </Table>
            </TableContainer>
        )
    }

    return (
        <>
            <h3> These are the available players: ----- 
                Data from child: {gameId} {otherPlayerId} {otherPlayerName}
                white player is: {whitePlayerId} black player is: {blackPlayerId} </h3>
            <ShowAvailablePlayers />
            <h3> STATUS: {invitationProgress} </h3>

            { invitationProgress === 1 && <MySentInvitations sendDataToParent={handleDataFromChild}/> }

            <MyInvitations sendDataToParent={handleDataFromChild}/>

            {gameId !== '' && <ChessGame playerId={localStorage.playerID}  gameId={gameId}/>}
        </>
    );
}

export { GameProcess };