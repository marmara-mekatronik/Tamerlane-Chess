function PrSq(sq){

    return (FileChar[FilesBrd[sq]-1] + RankChar[RanksBrd[sq]-1]);
}


function ParseMove(from,to) {

    GenerationMoves();
    var move=NOMOVE;
    var index;
    var found=Bool.False;



    for(index=GameBoard.moveListStart[GameBoard.ply];
          index<GameBoard.moveListStart[GameBoard.ply+1];index++){

        move=GameBoard.moveList[index];

        if(FROMSQ(move)==from && TOSQ(move)==to){

            console.log("move "+move);
            found=Bool.True;
            break;
        }
    }


    if(found !=Bool.False){

        if(MakeMove(move)==Bool.False){

            return NOMOVE;

        }
        TakeMove();
        return move;
    }

    return NOMOVE;
}

