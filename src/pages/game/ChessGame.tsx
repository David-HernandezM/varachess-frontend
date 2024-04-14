import { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { useEffect } from 'react';
import { Radio, RadioGroup, Stack, Input, Button} from '@chakra-ui/react'

interface contra_interface<myType> {
    w: myType;
    b: myType;
}

const contra: contra_interface<string> = {
    w: 'b',
    b: 'w'
};

interface Props {
    playerId: string;
    gameId: string;
    whitePlayerId: string;
    blackPlayerId: string;
  }

const ChessGame : React.FC<Props> = ( {playerId, gameId,whitePlayerId,blackPlayerId}) => {

    const [fen, setFen] = useState('start');
    const [game, setGame] = useState(new Chess());
    const [elementos, setElementos] = useState<string[]>(new Array<string>());
    const [turno, setTurno] = useState('w');

    const [nuevoElemento, setNuevoElemento] = useState('');

    const [count, setCount] = useState(0);

    const [playerColor, setPlayerColor] = useState<string>('w');
    //const [playerId, setPlayerId] = useState('0');
    // const [gameId, setGameId] = useState('0');


    const [checkState, setCheckState] = useState<boolean>(false);
    const [checkmateState, setCheckmateState] = useState<boolean>(false);
    const [drawState, setDrawState] = useState<boolean>(false);
    const [insufficientState, setInsufficientState] = useState<boolean>(false);
    const [stalemateState, setStalemateState] = useState<boolean>(false);
    const [threefoldState, setThreefoldState] = useState<boolean>(false);
    const [gameoverState, setGameoverState] = useState<boolean>(false);

    const [winner, setWinner] = useState<string>('None');

    

    useEffect(() => {
        setTurno(game.turn());

        if ( playerId == whitePlayerId){
            setPlayerColor('w')
        }else if(playerId == blackPlayerId) {
            setPlayerColor('b')
        }
        
        if(true){ 
        const interval = setInterval(() => {
            // initial state fen : rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
            const initFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
            const encodedInitFEN = encodeURI(initFen);
            setCount(count + 1);
            //console.log('this is the url to get: ' + `http://localhost:5000/play?player_id=${playerId}&player_color=${playerColor}&game_id=${gameId}&fen=pppp`)
            //console.log("This is the encoded FEN init" + encodedInitFEN);


            console.log("GOING to check if there is anything, opposite player's turn " + contra[playerColor as keyof typeof contra])
            fetch(`http://localhost:5000/status?game_id=${gameId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(" --- This is the fetched data")

                    console.log(JSON.stringify(data))
                    console.log("Current turn is: " + data.turn );
                    //if (data.turn == 'EMPTY' && fen !== 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19'){
                    if (data.turn !== 'EMPTY' ){

                        if (data.fen.includes('b')) {
                            setTurno('b')
                        } else {
                            setTurno('w')
                        }
    
                        setGame( new Chess(data.fen) )
                        setFen(game.fen())
                        console.log("Forcing the GAME to " + game.fen() + " with this turn " + turno)

                    }
                    //game.load(data.fen);
                    //setFen(data.fen);
                  
                })
                .catch(error => console.error(error));
            if (game.turn() === contra[playerColor as keyof typeof contra]) {

            }

            setCheckState(game.inCheck());
            setCheckmateState(game.isCheckmate());
            setDrawState(game.isStalemate());
            setInsufficientState(game.isInsufficientMaterial());
            setStalemateState(game.isStalemate());
            setThreefoldState(game.isThreefoldRepetition());
            setGameoverState(game.isGameOver());

            if( gameoverState === true ) {
                if ( turno === 'w') {
                    setWinner('b');
                } else {
                    setWinner('w');
                }
            }else {
                setWinner('None');
 
            }


        }, 500);

        return () => clearInterval(interval);
        }
        

    })

    const handleMove = (move: any) => {


        console.log(move);
        let move_in = { from: move.sourceSquare, to: move.targetSquare, promotion: 'q' };

        let destination = move_in.to;
        let destination_position = destination.substr(destination.length - 2, 2);

        console.log("I want to go to: " + destination_position)



        let move_res = game.moves({ square: move_in.from });
        let objectPiece = game.get(move_in.from);
        console.log("You want to move:" + objectPiece.color + " - " + objectPiece.type);
        console.log("These are the movements " + move_res);

        let move_res_f = move_res.map((s: string) => {
            return s.substr(s.length - 2, 2)
        });

        console.log("These are the movements (AGAIN): " + move_res_f);

        let valid_position = move_res_f.indexOf(destination_position);



        console.log("This is found at the array of possible landing positions: " + valid_position)

        /* || objectPiece.color === turno */
        if (turno == objectPiece.color && turno == playerColor) {
        //if (1) {


            let move_verb = game.moves({ square: move_in.from, verbose: true });
            console.log(move_verb);
            let found: boolean = false;
            move_verb.forEach(
                (m: any) => {
                    console.log("*** Move to: " + m.to + " has flags " + m.flags);
                    if (m.to == move_in.to) {
                        found = true;
                        console.log("------>This is where it will land")
                        setFen(m.after);
                        game.load(m.after);

                        const encodedNewFEN = encodeURI(m.after);

                        setTurno(contra[playerColor as keyof typeof contra])


                        fetch(`http://localhost:5000/play?player_id=${playerId}&game_id=${gameId}&player_color=${playerColor}&fen=${encodedNewFEN}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)


                            })
                            .catch(error => console.error(error));


                    }
                }

            );

        } else {
            console.log("TURN FOR OTHER PLAYER")
        }

    };

    const handleSnapEnd = (move: any) => {
        console.log("testing letting go");
    }

    const handlePieceClick = (square: any) => {
        console.log("Testing Clicked on  " + square);
        return true
    }

    function RadioColorSelect() {

        return (
            <RadioGroup onChange={setPlayerColor} value={playerColor}>
                <Stack direction='row'>
                    <Radio value='w'>WHITE</Radio>
                    <Radio value='b'>BLACK</Radio>

                </Stack>
            </RadioGroup>
        )
    }

    //function InputPlayerIdState() {
     //   return (
      //      <input type='text' onChange={e => setPlayerId(e.target.value)} value={playerId} />
    //    )
  //  }

    function ResetGame(){
        function resetGame(){
            console.log("Game will reset");
            fetch(`http://localhost:5000/play?player_id=${playerId}&game_id=${gameId}&player_color=${playerColor}`)
                .then(response => response.json())
                .then(data => {
                                console.log(data)


                            })
                .catch(error => console.error(error));
        }
        return(
        <Button onClick={resetGame} > RESET GAME </Button>
        );
    }


    return (
        <div>
            <h1> Player: {playerColor == 'w' ? 'WHITE' : 'BLACK'} </h1>
            
            <Chessboard
                position={fen}
                onDrop={(move) => handleMove(move)}
                dropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px #8F8' }}
                sparePieces={false}
                draggable={true}
                onMouseOutSquare={handleSnapEnd}
                onSquareClick={handlePieceClick}
            />

            <h1> ({count}) TURN: {turno == 'w' ? 'WHITE' : 'BLACK'} IS NEXT (You are {playerColor} Player ID: {playerId} Game ID: {gameId})</h1>
            <h2> Game States:</h2>
                <h3> Check: {checkState.toString()}</h3>
                <h3> Checkmate: {checkmateState.toString()} </h3> 
                <h3> Draw: {drawState.toString()} </h3> 
                <h3> Insufficient material: {insufficientState.toString()}</h3>
                <h3> StaleMate: {stalemateState.toString()}</h3>
                <h3> Threefold repetion: {threefoldState.toString()}</h3>
                <h3> GameOver: {gameoverState.toString()} </h3>
                <h3> Winner: {winner} </h3>
           
            <p> Player ID: {playerId} </p>
            <p> Game ID: {gameId} </p>
           
            
            <ResetGame />

        </div>
    );
};
export { ChessGame };
//  <input style={{ color: "blue" }} type='text' onChange={e => setPlayerId(e.target.value)} value={playerId} />

//  <input style={{ color: "red" }} type='text' onChange={e => setGameId(e.target.value)} value={gameId} />
