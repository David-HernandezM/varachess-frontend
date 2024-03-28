import { useState } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { useEffect } from 'react';


const ChessGame = () => {

    const [fen, setFen] = useState('start');
    const [game, setGame] = useState(new Chess());
    const [elementos, setElementos] = useState<string[]>(new Array<string>());
    const [turno, setTurno] = useState('');

    const [nuevoElemento, setNuevoElemento] = useState('');

    useEffect(() => {
        setTurno(game.turn());
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


        if (objectPiece.color === turno) {


            let move_verb = game.moves({ square: move_in.from, verbose: true });
            console.log(move_verb);
            let found: boolean = false;
            move_verb.forEach(
                (m: any) => {
                    console.log("*** Move to: " + m.to + " has flags " + m.flags);
                    if (m.to == move_in.to) {
                        found = true;
                        console.log("------>This is where it will land")
                        setFen( m.after );
                        game.load(  m.after );

                    }
                }

            );

            /*
            if ( found === false  ) return;

            game.move(move_in);


            elementos.push(move_in.to);

            setElementos([...elementos]);

            setNuevoElemento('');
            setFen(game.fen());

            console.log(elementos);
            console.log("TURN: " + game.turn());
            console.log("A5 has: " + game.get('a5'));
            */

        }

    };

    const handleSnapEnd = (move: any) => {
        console.log("testing letting go");
    }

    const handlePieceClick = (square: any) => {
        console.log("Testing Clicked on  " + square);
        return true
    }


    return (
        <div>
            <Chessboard
                position={fen}
                onDrop={(move) => handleMove(move)}
                dropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px #8F8' }}
                sparePieces={false}
                draggable={true}
                onMouseOutSquare={handleSnapEnd}
                onSquareClick={handlePieceClick}
            />
            
            <h1> TURN: {turno == 'w' ? 'WHITE' : 'BLACK'} IS NEXT</h1>
        </div>
    );
};
export { ChessGame };