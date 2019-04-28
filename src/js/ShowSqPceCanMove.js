function PieceIsOnSq(sq,top,left){

    if(RanksBrd[sq]==10-Math.round(top/60) &&
        FilesBrd[sq]==Math.round(left/60)){

        return Bool.True;
    }
    return Bool.False;
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
        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
        if(sq==sqOfPofP && wPromNumPofP==1 && RanksBrd[sqOfPofP]==WpromotionRank){

            return  Bool.False;
        }

    }else {

        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];
        if(sq==sqOfPofP && bPromNumPofP==1 && RanksBrd[sqOfPofP]==BpromotionRank){

            return  Bool.False;
        }


    }

    return Bool.True;


}


function TakeMovePieces(from,to) {

    GameBoard.pieces[from]=MovedPiece;
    GameBoard.pieces[to]=TakePiece;
}


function ProtectedKing(from,to) {

    var soleKing;

    if(GameBoard.side==COLOURS.WHITE) soleKing=GameBoard.WhiteOnlyKingInGame;

    else soleKing=GameBoard.BlackOnlyKingInGame;

    if(soleKing!=0){

        if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){

            T_MovePiece(from,to);

            if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){
                TakeMovePieces(from, to);
                return Bool.True;
            }
            TakeMovePieces(from, to);
        }
        else{
            T_MovePiece(from, to);
            if (SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False) {
                TakeMovePieces(from, to);
                return Bool.True;
            }
            TakeMovePieces(from, to);
        }

    }else if( (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length>1) ||
              (GameBoard.side==COLOURS.BLACK && GameBoard.BlackKingsInGame.length>1) ){

        return Bool.True;

    }

    return Bool.False;
}

function ShowAllSqPceCanMove(sq,clickedPiece) {

    var index,pce,new_sq;


    if(MovetoFork()==Bool.False && MoveToInitPosPawnofKing()==Bool.False &&
       SwitchPlaceOfKing()==Bool.False && AdKingMoveFromCitadel()==Bool.False){

        ShowUsualSquaresPieceCanMove(sq,clickedPiece);
    }
    else if(MoveToInitPosPawnofKing()==Bool.True){

        if(clickedPiece==PIECES.WpiyonP && GameBoard.side==COLOURS.WHITE) sq=WinitSqPofK;
        else if(clickedPiece==PIECES.BpiyonP && GameBoard.side==COLOURS.BLACK) sq=BinitSqPofK;

        $(".Square").each(function () {

            if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){
                $(this).addClass("SqAttacked");
            }
        });

    }else if( SwitchPlaceOfKing()==Bool.True){

        if(clickedPiece==GameBoard.WhiteHighestRanKING && GameBoard.side==COLOURS.WHITE){

            for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){

                pce=GameBoard.WhiteKingsInGame[index];
                if(pce==GameBoard.WhiteHighestRanKING) continue;
                new_sq=GameBoard.pList[PCEINDEX(pce,0)];

                $(".Square").each(function () {

                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True){
                        $(this).addClass("SqAttacked");
                    }
                });

            }

        }else if(clickedPiece==GameBoard.BlackHighestRanKING && GameBoard.side==COLOURS.BLACK){


            for(index=0;index<GameBoard.BlackKingsInGame.length;index++){

                pce=GameBoard.BlackKingsInGame[index];
                if(pce==GameBoard.BlackHighestRanKING) continue;

                new_sq=GameBoard.pList[PCEINDEX(pce,0)];

                $(".Square").each(function () {

                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True){
                        $(this).addClass("SqAttacked");
                    }
                });
            }
        }
    }
    else if(AdKingMoveFromCitadel()!=Bool.False){


        if( (clickedPiece==PIECES.WmaceraciSah && GameBoard.side==COLOURS.WHITE) ||
            (clickedPiece==PIECES.BmaceraciSah && GameBoard.side==COLOURS.BLACK)){

            $(".Square").each(function () {

                if(PieceIsOnSq(AdKingMoveFromCitadel(),$(this).position().top,$(this).position().left)==Bool.True){
                    $(this).addClass("SqAttacked");
                }
            });

        }
    }
    else if(MovetoFork()==Bool.True) ShowForkingSquares(clickedPiece);


}


function ShowForkingSquares(clickedPiece) {
    var index,sq;

    $(".Square").each(function () {
        console.log("clickedPiece "+clickedPiece);
        if(clickedPiece==PIECES.WpiyonP){

            for(index=0;index<GameBoard.WforkList.length;index++){
                sq=GameBoard.WforkList[index];
                if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){
                    $(this).addClass("SqAttacked");
                }
            }
        }
        else if(clickedPiece==PIECES.BpiyonP){
            for (index = 0; index < GameBoard.BforkList.length; index++) {
                sq = GameBoard.BforkList[index];
                if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == Bool.True) {
                    $(this).addClass("SqAttacked");
                }
            }
        }
    });
}


function ShowUsualSquaresPieceCanMove(sq,clickedPiece) {


    $(".Square").each(function () {

        var index,j,Cal_sq;

        for(index=0;index<WhitePawns.length;index++){

            if(clickedPiece==WhitePawns[index]){

                if (PawnAttackedSqStraightWhite(sq+PawnsFowards)==Bool.True ) {

                    if(ProtectedKing(sq,sq+PawnsFowards)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,sq+PawnsFowards)==Bool.True){

                        if(PieceIsOnSq(sq+PawnsFowards,$(this).position().top,$(this).position().left)==Bool.True){

                            $(this).addClass("SqAttacked");
                        }
                    }
                }

                for(j=0;j<PawnDiagonal.length;j++){

                    if (PawnAttackedSqDiagonalWhite(sq+PawnDiagonal[j])==Bool.True ) {

                        if(ProtectedKing(sq,sq+PawnDiagonal[j])==Bool.True && NotCapturedPawnOfPawn(clickedPiece,sq+PawnDiagonal[j])==Bool.True){

                            if(PieceIsOnSq(sq+PawnDiagonal[j],$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }
                    }
                }
            }
        }

        for(index=0;index<BlackPawns.length;index++){

            if(clickedPiece==BlackPawns[index]){

                if (PawnAttackedSqStraightBlack(sq-PawnsFowards)==Bool.True ) {

                    if(ProtectedKing(sq,sq-PawnsFowards)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,sq-PawnsFowards)==Bool.True){

                        if(PieceIsOnSq(sq-PawnsFowards,$(this).position().top,$(this).position().left)==Bool.True){

                            $(this).addClass("SqAttacked");
                        }
                    }
                }

                for(j=0;j<PawnDiagonal.length;j++){

                    if (PawnAttackedSqDiagonalBlack(sq-PawnDiagonal[j])==Bool.True ) {

                        if(ProtectedKing(sq,sq-PawnDiagonal[j])==Bool.True && NotCapturedPawnOfPawn(clickedPiece,sq-PawnDiagonal[j])==Bool.True){

                            if(PieceIsOnSq(sq-PawnDiagonal[j],$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }
                    }
                }
            }
        }

        var PieceNumber,Direction,new_sq;

        for(index=0;index<LoopNonSlidePieces.length;index++){

            for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[clickedPiece]; ++PieceNumber) {
                Cal_sq = GameBoard.pList[PCEINDEX(clickedPiece, PieceNumber)];

                if( LoopNonSlidePieces[index] == clickedPiece && sq==Cal_sq) {

                    for (j = 0; j < DirectionNumber[clickedPiece]; j++) {
                        Direction = PieceDirection[clickedPiece][j];

                        new_sq = sq + Direction;

                        if (SQOFFBOARD(new_sq) == Bool.True) {

                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side ) {

                                if(new_sq==88 || new_sq==181){
                                    continue;
                                }

                                if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                        PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                        $(this).addClass("SqAttacked");
                                    }

                                }
                            }
                        } else {

                            if(new_sq==88 || new_sq==181){
                                continue;
                            }

                            if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                    PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                    $(this).addClass("SqAttacked");
                                }
                            }
                        }
                    }
                }
            }
        }

        for(index=0;index < LoopSlideKale.length;index++){

            for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[clickedPiece]; ++PieceNumber) {
                Cal_sq = GameBoard.pList[PCEINDEX(clickedPiece, PieceNumber)];

                if( LoopSlideKale[index] == clickedPiece && sq==Cal_sq) {

                    for (index = 0; index < DirectionNumber[clickedPiece]; index++) {
                        Direction = PieceDirection[clickedPiece][index];
                        new_sq = sq + Direction;

                        while (SQOFFBOARD(new_sq) == Bool.False) {

                            if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                                if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                    if(new_sq==88 || new_sq==181){
                                        new_sq += Direction;
                                        continue;
                                    }

                                    if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }

                                }
                                break;
                            }
                            if(new_sq==88 || new_sq==181){
                                new_sq += Direction;
                                continue;
                            }

                            if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                    PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                    $(this).addClass("SqAttacked");
                                }
                            }

                            new_sq += Direction;
                        }
                    }
                }
            }
        }

        for(index=0;index < LoopSlideMancinik.length;index++){

            for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[clickedPiece]; ++PieceNumber) {
                Cal_sq = GameBoard.pList[PCEINDEX(clickedPiece, PieceNumber)];

                if( LoopSlideMancinik[index] == clickedPiece && sq==Cal_sq) {

                    for (j = 0; j < DirectionNumber[clickedPiece]; j++) {
                        Direction = PieceDirection[clickedPiece][j];
                        new_sq = sq + Direction;

                        if(GameBoard.pieces[sq+GENERAL_direction[j]]==PIECES.EMPTY){

                            while (SQOFFBOARD(new_sq) == Bool.False) {

                                if (GameBoard.pieces[new_sq] != PIECES.EMPTY  ) {

                                    if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                        if(new_sq==88 || new_sq==181){
                                            new_sq += GENERAL_direction[j];
                                            continue;
                                        }

                                        if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                            if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                                PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                                $(this).addClass("SqAttacked");
                                            }
                                        }

                                    }
                                    break;
                                }

                                if(new_sq==88 || new_sq==181){
                                    new_sq += GENERAL_direction[j];
                                    continue;
                                }

                                if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                        PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                        $(this).addClass("SqAttacked");
                                    }
                                }

                                new_sq += GENERAL_direction[j];
                            }
                        }
                    }
                }
            }
        }

        for(index=0;index < LoopSlideZurafa.length;index++){

            for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[clickedPiece]; ++PieceNumber) {
                Cal_sq = GameBoard.pList[PCEINDEX(clickedPiece, PieceNumber)];

                if(LoopSlideZurafa[index]==clickedPiece && sq==Cal_sq){

                    for(j=0;j<DirectionNumber[clickedPiece];j++){

                        Direction = PieceDirection[clickedPiece][j];
                        new_sq = sq + Direction;

                        if(GameBoard.pieces[sq+ZURAFA3_direction[j]]==PIECES.EMPTY && GameBoard.pieces[sq+AT_direction[j]]==PIECES.EMPTY &&
                            GameBoard.pieces[sq+DEVE_direction[j]]==PIECES.EMPTY ){

                            while (SQOFFBOARD(new_sq) == Bool.False) {

                                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                                    if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                        if(new_sq==88 || new_sq==181){
                                            new_sq += ZURAFA2_direction[j];
                                            continue;
                                        }


                                        if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                            if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                                PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                                $(this).addClass("SqAttacked");
                                            }
                                        }

                                    }
                                    break;
                                }
                                if(new_sq==88 || new_sq==181){
                                    new_sq += ZURAFA2_direction[j];
                                    continue;
                                }

                                if(ProtectedKing(sq,new_sq)==Bool.True && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                        PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                        $(this).addClass("SqAttacked");
                                    }
                                }

                                new_sq += ZURAFA2_direction[j];
                            }
                        }
                    }
                }
            }
        }

        for(index=0;index < LoopKings.length;index++){

            for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[clickedPiece]; ++PieceNumber) {
                Cal_sq = GameBoard.pList[PCEINDEX(clickedPiece, PieceNumber)];

                if (LoopKings[index] == clickedPiece && sq == Cal_sq) {

                    for (j = 0; j < DirectionNumber[clickedPiece]; j++) {
                        Direction = PieceDirection[clickedPiece][j];

                        new_sq = sq + Direction;

                        if (SQOFFBOARD(new_sq) == Bool.True) {

                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {

                            if(new_sq==WsideCitadel || new_sq==BsideCitadel) continue;

                            if ( PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                if(GameBoard.side==COLOURS.WHITE){

                                    if( ( (GameBoard.WhiteKingsInGame.length==1 && SqAttacked(new_sq,GameBoard.side^1)==Bool.False) ||
                                         (GameBoard.WhiteKingsInGame.length>1) )  && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True){

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }
                                }

                                if(GameBoard.side==COLOURS.BLACK){

                                    if( ( (GameBoard.BlackKingsInGame.length==1 && SqAttacked(new_sq,GameBoard.side^1)==Bool.False) ||
                                        (GameBoard.BlackKingsInGame.length>1)) && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True) {

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }
                                }
                            }
                        }

                        else {

                            if (PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE) {

                                if( (new_sq==WsideCitadel  && GameBoard.pieces[sq]!=PIECES.WmaceraciSah) ||
                                    (new_sq==BsideCitadel && GameBoard.pieces[sq]!=GameBoard.WhiteHighestRanKING)){

                                    continue;
                                }

                                if(GameBoard.side==COLOURS.WHITE){

                                    if( ((GameBoard.WhiteKingsInGame.length==1 && SqAttacked(new_sq,GameBoard.side^1)==Bool.False) ||
                                        (GameBoard.WhiteKingsInGame.length>1) ) && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True ) {

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }
                                }

                            } else if (PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK) {


                                if( (new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BmaceraciSah) ||
                                    (new_sq==WsideCitadel && GameBoard.pieces[sq]!=GameBoard.BlackHighestRanKING) ){

                                    continue;
                                }

                                if(GameBoard.side==COLOURS.BLACK){

                                    if( ( (GameBoard.BlackKingsInGame.length==1 && SqAttacked(new_sq,GameBoard.side^1)==Bool.False) ||
                                        (GameBoard.BlackKingsInGame.length>1) ) && NotCapturedPawnOfPawn(clickedPiece,new_sq)==Bool.True ) {

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}


