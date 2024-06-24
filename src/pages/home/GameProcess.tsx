import React, { useState } from 'react';
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, 
} from '@chakra-ui/react'

import {PlayButton} from './PlayButton'
// import { ContractStartGame } from './ContractStartGame';
import {AcceptEndButton} from './AcceptEndButton'

import { stringCamelCase } from '@polkadot/util';


interface CancelProps {
    invitation_id: string;
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string, arg6:number ) => void

}
const CancelButton : React.FC<CancelProps> = ({ invitation_id, sendDataToParent }) => {
    const CancelInvitation = () =>{
        console.log("You want to cancel invitation with this id" + invitation_id  )
        fetch(`https://vchess.pythonanywhere.com/acceptdeclineinvitation/${invitation_id}/0`)
            .then(response => response.json())
            .then(data => {
                console.log("You tried to CANCEL your invitation, here is response: ");
                console.log(data);
                sendDataToParent("", "", "", "", "", 0)
                
            })
            .catch(error => console.error(error));
    }
    return (
        <Button onClick={CancelInvitation} colorScheme='red' > Cancel </Button>
    )
}

interface PropsMySentInvitations {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string, arg6:number ) => void

}

const MySentInvitations: React.FC<PropsMySentInvitations>  = ( {sendDataToParent} ) => {
    const [myArray, setMyArray] = useState<string[][]>([]);
    useEffect( () => {
        const interval = setInterval(() => {
            fetch(`https://vchess.pythonanywhere.com/mysentinvitations/${localStorage.playerID}`)
            .then(response => response.json())
            .then(data => {
                console.log("MY INVITATIONS: ");
                console.log(data)
                setMyArray(data);
                const myId : string = localStorage.playerID as string ;

                if( data.length > 0){
                    console.log("GOT SOMETHING GOOD IN MY INVITATIONS")
                    
                    //data.forEach( (r:string) => {
                    //    console.log("r[5] says: " + r[5] +" ... " + typeof(r[5]))
                    //    if( r[5] == 'ACCEPTED' ) {
                    //        console.log("~~~~The game has been accepted!!!");
                    //        sendDataToParent(r[6], r[1], r[7], r[8],r[9])
                    //    }
                    console.log("data[5] says: " + data[5] +" ... " + typeof(data[5]))
                    const players = [data[1], data[2]];
                    console.log("The players are: " + players.toString() )
                    const otherPlayer = data[2]
                    const otherPlayerName = data[7];
                    console.log("The other player is " +otherPlayerName + " " + otherPlayer);
                    const player_id_white = data[8];
                    const player_id_black = data[9];
                    const game_id = data[6];
                    console.log("Player White: " + player_id_white)
                    console.log("Player Black: " + player_id_black)
                    console.log("Game Id: " + game_id)
                    if( game_id > 0 ){
                        sendDataToParent(game_id, otherPlayer, otherPlayerName, player_id_white, player_id_black, 3)

                    }

                    // check if they are declined...

                    
                    


                } else {
                    
                   sendDataToParent("", "", "", "", "", 0)
                }
                
            })
            .catch(error => console.error(error));
        }, 500);
    return () => clearInterval(interval);
    }, [])

    

    const Row = (item:string[]) => {
        return (
            <Tr> <Td> {item[7]} </Td>  
            <Td> {item[5]}  </Td>
            <Td> <CancelButton  invitation_id={ item[0] } sendDataToParent={sendDataToParent} /> </Td>
            </Tr>
        )
    }

    // <p> {item[0]} {item[1]} {item[2]} {item[3]}  {item[4]} {item[5]} {item[6]} {item[7]} </p> 

    return (
        <>
        <h3> These are the sent invitations </h3>
        <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Inviting Player</Th>
                            <Th>Status </Th>
                            <Th> Cancel </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
        {myArray.map((item, index) =>  ( 
            item[5] !== "DECLINED" ? Row (item) : ""
        ))}
        </Tbody>
        </Table>
        </TableContainer>
        </>
    )
}


interface Props {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string, arg6:number) => void
    player_id_from: string;
    player_name_from: string;
    player_id_white: string;
    player_id_black: string;
    invitation_id: string;

  }
  const AcceptButton: React.FC<Props> = ({sendDataToParent, player_id_from, player_name_from, player_id_white, player_id_black, invitation_id}) => {
    const [gameid, setGameId] = useState<string>("");
    const acceptInvitation = () => {
        console.log("You want to accept the invitation from  " + player_name_from)

        
        //fetch(`https://vchess.pythonanywhere.com/acceptdeclineinvitation/${invitation_id}/1`)
        fetch(`https://vchess.pythonanywhere.com/acceptdeclineinvitation/${invitation_id}/1`)

        .then(response => response.json())
        .then(data => {
            console.log("You tried to accept invitation, here is response: " + data);
            console.log(data);
            setGameId(data)
            sendDataToParent(data, player_id_from, player_name_from,player_id_white, player_id_black, 2 )
            
        })
        .catch(error => console.error(error));
    }

    return (
        <Button onClick={acceptInvitation} colorScheme='teal' > Accept </Button>

    );
  };

  interface DeclineProps {
    invitation_id: string;
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string, arg6:number) => void
    
}
const DeclineButton: React.FC <DeclineProps> = ( {sendDataToParent, invitation_id  } ) =>{
    const declineInvitation = () => {
        console.log("Decline invitation with id " + invitation_id)

        fetch(`https://vchess.pythonanywhere.com/acceptdeclineinvitation/${invitation_id}/0`)
            .then(response => response.json())
            .then(data => {
                console.log("You tried to DECLINE the invitation, here is response: ");
                console.log(data);
                
                
            })
            .catch(error => console.error(error));

            sendDataToParent("", "", "", "", "", 0)
    }
    return ( 
        <Button onClick={declineInvitation} colorScheme='red' > Decline </Button>
  )
}

  interface IsecondChildProps {
    sendDataToParent: (arg: string, arg2:string, arg3:string, arg4:string, arg5:string, arg6: number) => void
  
  }

const MyInvitations: React.FC<IsecondChildProps> = ({sendDataToParent}) => {
    const [myArray, setMyArray] = useState<string[][]>([]);
    useEffect( () => {
        const interval = setInterval(() => {
        
            fetch(`https://vchess.pythonanywhere.com/myinvitations/${localStorage.playerID}`)
            .then(response => response.json())
            .then(data => {
                console.log("I AM BEEING INVITED TO: ");
                console.log(data)
                console.log("THIS IS THE FIRST ELEMENT: " + data[0])
                setMyArray([ ... data ]);
                data.forEach( (r:string[]) => {
                    console.log("data[5] says: " + r[5] +" ... " + typeof(r[5]))
                    if( r[5] === 'ACCEPTED'){
                        const players = [r[1], r[2]];
                        console.log("The players are: " + players.toString() )
                        const otherPlayer = r[2]
                        const otherPlayerName = r[7];
                        console.log("The other player is " +otherPlayerName + " " + otherPlayer);
                        const player_id_white = r[8];
                        const player_id_black = r[9];
                        const game_id = r[6];
                        console.log("Player White: " + player_id_white)
                        console.log("Player Black: " + player_id_black)
                        console.log("Game Id: " + game_id)
                        sendDataToParent(game_id, otherPlayer, otherPlayerName, player_id_white, player_id_black, 2)
                    }
                });

                
            })
            .catch(error => console.error(error));
        }, 500);
        return () => clearInterval(interval);
    }, [myArray])

    
    interface RowProp {
        item : string[];
    }
    const Row : React.FC<RowProp> = ({item}) => {
        return (
            <Tr> <Td> {item[7]} - {item[5]} </Td>  
            <Td> <AcceptButton  sendDataToParent={sendDataToParent} player_id_from={item[1]} 
                        player_name_from={item[7]} player_id_white={item[8]} player_id_black={item[9]}
                        invitation_id={item[0]}/> 
            </Td>
            <Td> <DeclineButton sendDataToParent={sendDataToParent} invitation_id={item[0]} /></Td>
            </Tr>
        )
    }

    return (
        <>
        <h3> I am being invited to:</h3>

        <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Player Inviter</Th>
                            <Th>Accept? </Th>
                            <Th>Decline? </Th>
                        </Tr>
                    </Thead>
                    <Tbody>

                    
        {myArray.map((item) =>  ( 
            
            item[5] == 'WAITING' ? Row ({item}) : ""
        ))}

        </Tbody>
        </Table>
        </TableContainer>
        
        </>
    )
}

interface ForfeitProps {
    parentFunction: (playing: boolean) => void;
    gameId: string;
    otherPlayerId: string;
}

const ForfeitGame: React.FC<ForfeitProps> = ({parentFunction, gameId, otherPlayerId}) => {

    const handleClick = () => {
        console.log("You want to cancel the game")
        fetch(`https://vchess.pythonanywhere.com/endgame/${gameId}/${otherPlayerId}/${localStorage.playerID}/2`)
        .then(response => response.json())
        .then(data => {
            console.log("FORFEIT status: ");
            console.log(data)
            if (data===true){
                console.log("FORFEIT  successfuly ");
                parentFunction(false)     //instead of setPlaying(false)
                
                
            } else {
                console.log("FORFEIT  problem ");
            }
        })
        .catch(error => console.error(error));
    }
    

    return( <Button onClick = {handleClick}> Forfeit game</Button> )

}
interface ShowAvailablePlayersProps {
    players: string[][];
    parentSelectPlayer: (arg1: string) => void;
}


const ShowAvailablePlayers:React.FC<ShowAvailablePlayersProps> = ({players, parentSelectPlayer}) => {
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
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Players</Th>
                        <Th>ID </Th>
                        <Th>STATUS </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {players.map((item) =>  ( 
                        <Tr>
                        <Td > <Button isDisabled={disableButton(item[3])} onClick={() => parentSelectPlayer(item[2])} > {item[0]} </Button> </Td>
                        <Td>{item[2]}</Td>
                        <Td>{item[3]}</Td>
                        </Tr>
                    ))}
                    
                    
                </Tbody>
                
            </Table>
        </TableContainer>
    )
}


function BasicUsage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              This is some data
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }


const ButtonForModal: React.FC = () => {
    return(
        <Button onClick={BasicUsage}>Click here to open a dialog</Button>
    )
}

const GameProcess = () => {
    const [players, setPlayers] = useState<string[][]>([]);
    const [invitationProgress, setInvitationProgress] = useState<number>(0);
    const [gameId, setGameId] = useState<string>("");
    const [otherPlayerId, setOtherPlayerId] = useState("");
    const [otherPlayerName, setOtherPlayerName] = useState("");
    const [whitePlayerId, setWhitePlayerId] = useState("");
    const [blackPlayerId, setBlackPlayerId] = useState("");

    const [message, setMessage] = useState("Game in Progress");
    const [messageTmp, setMessageTmp] = useState("Game in Progress");
    const [showModalOnce, setShowModalOnce] = useState<boolean>(true);

    const [playing, setPlaying] = useState<boolean>(true);

    const [hideForfeitButton, setHideForfeitButton]  = useState<boolean>(false);

    const [displayBoard, setDisplayBoard] = useState<boolean>(false);

    const [gameState, setGameState] = useState<string>("");

    const [playerWinner, setPlayerWinner] = useState<string>("");
    const [playerLoser, setPlayerLoser] = useState<string>("");

    const [contractStart, setContractStart] = useState<string>("UNINITIATED");

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleDataFromChild = (gameId: string, otherPlayerId: string, otherPlayerName: string,
                                whitePlayerId: string, blackPlayerId: string, progress: number):void => {
        setGameId(gameId);
        setOtherPlayerId(otherPlayerId);
        setOtherPlayerName(otherPlayerName);
        setWhitePlayerId(whitePlayerId);
        setBlackPlayerId(blackPlayerId);
        setInvitationProgress(progress);
        if(gameId !== "" ) {
            setInvitationProgress(3);
            
        }

    }

    

    useEffect(() => { 
        setMessageTmp(message)

        

        if( gameState == 'FINISHED' ) {  
            fetch(`https://vchess.pythonanywhere.com/endgame/${gameId}/${playerWinner}/${playerLoser}/1`)
            .then(response => response.json())
            .then(data => {
                console.log("~~~~~~~~~~~~~~~~~ END GAME status: ");
                console.log(data)
                
            })
            .catch(error => console.error(error));

        }

        const interval = setInterval(() => {
            console.log("==================> GAMEID >>" + gameId + "<<")
            
            if( gameId !== '' ){
                console.log("~~~~~GameId is set " + gameId)
                setDisplayBoard(true)
                   fetch(`https://vchess.pythonanywhere.com/gamestatus/${gameId}`)
                        .then(response => response.json())
                        .then(data => {
                                
                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~Getting game status:")
                            console.log(data);
                            setMessage( data[4] ); // place the status of the game on the message

                            setGameId(data[0]);
                            setWhitePlayerId(data[8]);
                            setBlackPlayerId(data[9]);
                            
                            


                            if( data[4] == "FORFEIT"){
                                setPlaying(false)
                                setMessage("FORFEIT")
                                
                               // if (showModalOnce === true) {
                                 //   onOpen()
                                 //   setShowModalOnce(false)

                                // }
                                    
                                    
                                
                                

                            }
                        })
                        .catch(error  => console.error(error));

                        

                        
            } else {
                fetch(`https://vchess.pythonanywhere.com/listplayers`)
                    .then(response => response.json())
                    .then(data => {
                        // setInvitationProgress(1);
                        console.log("---------------------Called the list of players")
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
                fetch(`https://vchess.pythonanywhere.com/checkifingame/${localStorage.playerID}`)
                    .then(response => response.json())
                    .then(data => {
                        // setInvitationProgress(1);
                        console.log("/////// am I in a game???")
                        console.log(data);
                        if ( data.length > 0 )
                            setGameId(data[0]);
                            setWhitePlayerId(data[8]);
                            setBlackPlayerId(data[9]);
                            setMessage(data[4])
                            setPlaying(true)

                          

                            if ( data[4] == 'FORFEIT' ) {
                                setPlaying(false)
                                //onOpen()
                            }

                    })
                    .catch(error => console.error(error));

                
            }



            }, 1000);
            return () => clearInterval(interval);
    }, [gameId, gameState])

    const selectPlayer = (player_id: string) => {
        console.log("You have player ID" + localStorage.playerID + " with ID: " + player_id)
        fetch(`https://vchess.pythonanywhere.com/invite?player_id_from=${localStorage.playerID}&player_id_to=${player_id}`)
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

    

    

 
    const AcceptAndReset = () => {
        const handleClick = () => {
            setGameId("");
            setOtherPlayerId("");
            setOtherPlayerName("");
            setWhitePlayerId("");
            setBlackPlayerId("");
            setInvitationProgress(0);
            setPlaying(true)

            setContractStart("UNINITIATED")

            setGameState("NO GAME")
            setPlayerWinner("UNDETERMINED")
            setPlayerLoser("UNDETERMINED")

            //fetch(`https://vchess.pythonanywhere.com/closegame/${gameId}`)
            //.then(response => response.json())
            //.then(data => {
            //    console.log("CLOSE GAME status: ");
            //    console.log(data)
            //})
            //.catch(error => console.error(error));

        }

        return( <Button onClick = {handleClick}> Accept </Button> )
    }

    
    const handleBoardState = (playing: boolean, gameState: string, playerWinner: string, playerLoser: string) => {
        setPlaying(playing)
        setGameState(gameState)
        setPlayerWinner(playerWinner)
        setPlayerLoser(playerLoser)
    }

    const parentForfeitFunction = (playing: boolean) => {
        setPlaying(playing)
        setHideForfeitButton(true)
    }

    const parentSelectPlayer = (player: string) => {
        selectPlayer(player)
    }

    const parentInitiateGame = (stateGame: string) => {
        setContractStart(stateGame);
    }

    const parentAcceptEndFunction = (stateGame: string) => {
        setContractStart(stateGame);
 
        setGameId("");
        setOtherPlayerId("");
        setOtherPlayerName("");
        setWhitePlayerId("");
        setBlackPlayerId("");
        setInvitationProgress(0);
        setPlaying(true)

        // setContractStart("UNINITIATED")

        setGameState("NO GAME")
        setPlayerWinner("UNDETERMINED")
        setPlayerLoser("UNDETERMINED")

    }

    return (
        <>
         
            <h3> These are the available players: ----- 
                Data from child: {gameId} {otherPlayerId} {otherPlayerName}
                white player is: {whitePlayerId} black player is: {blackPlayerId} </h3>
                <h3> Playing Boolean: {playing.toString()}</h3>
            { invitationProgress === 0  && <ShowAvailablePlayers players={players} parentSelectPlayer={parentSelectPlayer} /> }
            <h3> STATUS: {invitationProgress} showModalOnce: {showModalOnce.toString()}  </h3>

            { invitationProgress !== 3 &&  <MySentInvitations sendDataToParent={handleDataFromChild}/> }

            { invitationProgress !== 3 && <MyInvitations sendDataToParent={handleDataFromChild}/> }

            {gameId !== '' && <h1> MESSAGE: {message} / {gameState} / WINS: {playerWinner} LOSES: {playerLoser} </h1> }

            { (gameId !== '' ) && <PlayButton parentSetContract={parentInitiateGame} gameId={gameId}/>}

            { ( gameId !== ''  && contractStart == 'INITIATED') && <ChessGame playerId={localStorage.playerID}  gameId={gameId} 
                                        whitePlayerId={whitePlayerId} blackPlayerId={blackPlayerId} 
                                        draggable= {playing}  handleBoardState={handleBoardState}/>}
        
            {(gameId !== '' && contractStart == 'INITIATED' && hideForfeitButton == false ) && <ForfeitGame parentFunction={parentForfeitFunction} gameId={gameId} otherPlayerId={otherPlayerId}/> }

            {( gameId !== '' && playing === false)  && <AcceptEndButton parentSetContract={parentAcceptEndFunction}/>}

            

            

            <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Game message:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {message}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='teal' mr={3} onClick={onClose}>
                Close
              </Button>
              
            </ModalFooter>
          </ModalContent>
            </Modal>
        </>
    );
}

export { GameProcess };


