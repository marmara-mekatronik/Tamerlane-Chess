function PieceIsOnSq(sq,top,left){

    if(RanksBrd[sq]==10-Math.round(top/60) &&
        FilesBrd[sq]==Math.round(left/60)){

        return Bool.True;
    }
    return Bool.False;
}

function TakeMovePieces(from,to) {

    GameBoard.pieces[from]=MovedPiece;
    GameBoard.pieces[to]=TakePiece;
}

function T_MovePiece(from,to) {

    MovedPiece=GameBoard.pieces[from];
    TakePiece=GameBoard.pieces[to];
    GameBoard.pieces[from]=PIECES.EMPTY;
    GameBoard.pieces[to]=MovedPiece;

}



function NotCapturedPawnOfPawn(piece,sq) {

    var sqOfPofP;

    if(PieceColor[piece]==COLOURS.BLACK){
        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
        if(sq==sqOfPofP && wPromNumPofP==1 && RanksBrd[sqOfPofP]==WpromotionRank){

            return  Bool.False;
        }

    }else {

        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];
        if(sq==sqOfPofP && bPromNumPofP==1 && RanksBrd[sqOfPofP]==BpromotionRank){

            return  Bool.False;
        }


    }

    return Bool.True;


}



function ProtectedKing(from,to) {

    var soleKing;

    if(GameBoard.side==COLOURS.WHITE) soleKing=GameBoard.WhiteOnlyKingInGame;

    else soleKing=GameBoard.BlackOnlyKingInGame;


    if(soleKing!=0){

        if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){

            T_MovePiece(from,to);

            if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){
                TakeMovePieces(from,to);
                return Bool.True;
            }
            TakeMovePieces(from,to);
        }
        else{

            T_MovePiece(from, to);
            if (SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False) {

                TakeMovePieces(from,to) ;
                return Bool.True;
            }
            TakeMovePieces(from,to);
        }

    }else if( (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length>1) ||
              (GameBoard.side==COLOURS.BLACK && GameBoard.BlackKingsInGame.length>1) ){

        return Bool.True;

    }

    return Bool.False;
}


function ShowSquaresPieceCanMove(from,clickedPiece) {

    var index,move;

    $(".Square").each(function () {


        for(index=GameBoard.moveListStart[GameBoard.ply];
            index<GameBoard.moveListStart[GameBoard.ply+1];index++){

            move=GameBoard.moveList[index];

            if(FROMSQ(move)==from && ProtectedKing(from,TOSQ(move))==Bool.True &&
                NotCapturedPawnOfPawn(clickedPiece,TOSQ(move))==Bool.True &&
                PieceIsOnSq(TOSQ(move),$(this).position().top,$(this).position().left)==Bool.True){

                $(this).addClass("SqAttacked");
            }
        }
    });
}


