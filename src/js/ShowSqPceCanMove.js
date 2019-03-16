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


function TakeMovePieces(from,to) {

    GameBoard.pieces[from]=MovedPiece;
    GameBoard.pieces[to]=TakePiece;
}


function ProtectedKing(from,to) {

    if( (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteNumberOfKingsInGame==1) ||
        (GameBoard.side==COLOURS.BLACK && GameBoard.BlackNumberOfKingsInGame==1) ){


        if(SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side^1) == Bool.False){

            T_MovePiece(from,to);

            if(SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side^1) == Bool.False){
                TakeMovePieces(from, to);
                return Bool.True;
            }
            TakeMovePieces(from, to);
        }
        else{
            T_MovePiece(from, to);
            if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side^1) == Bool.False) {
                TakeMovePieces(from, to);
                return Bool.True;
            }
            TakeMovePieces(from, to);
        }
    }
    else if( (GameBoard.side==COLOURS.WHITE && (GameBoard.WhiteNumberOfKingsInGame==2 || GameBoard.WhiteNumberOfKingsInGame==3)   )  ||
             (GameBoard.side==COLOURS.BLACK && (GameBoard.BlackNumberOfKingsInGame==2 || GameBoard.BlackNumberOfKingsInGame==2)   )  ){

        return Bool.True;
    }

    return Bool.False;
}

function ShowAllSqPceCanMove(sq,clickedPiece) {
    console.log("MovetoFork()  "+MovetoFork());

    if(MovetoFork()==Bool.False){

        ShowUsualSquaresPieceCanMove(sq,clickedPiece);
    }
    else ShowForkingSquares(clickedPiece);

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

        if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){

            for(index=0;index<(piyonlar.length)/2 ;index++){

                if(clickedPiece==piyonlar[index]){

                    if (PawnAttackedSqStraightWhite(sq+15)==Bool.True ) {

                        if(ProtectedKing(sq,sq+15)==Bool.True){

                            if(PieceIsOnSq(sq+15,$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }
                    }

                    for(j=0;j<PlayerColor.length;j++){

                        if (PawnAttackedSqDiagonalWhite(sq+PlayerColor[j])==Bool.True ) {

                            if(ProtectedKing(sq,sq+PlayerColor[j])==Bool.True){

                                if(PieceIsOnSq(sq+PlayerColor[j],$(this).position().top,$(this).position().left)==Bool.True){

                                    $(this).addClass("SqAttacked");
                                }
                            }
                        }
                    }
                }
            }

            for(index=(piyonlar.length)/2;index<piyonlar.length;index++){

                if(clickedPiece==piyonlar[index]){

                    if (PawnAttackedSqStraightBlack(sq-15)==Bool.True ) {

                        if(ProtectedKing(sq,sq-15)==Bool.True){

                            if(PieceIsOnSq(sq-15,$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }
                    }

                    for(j=0;j<EngineColor.length;j++){

                        if (PawnAttackedSqDiagonalBlack(sq+EngineColor[j])==Bool.True ) {

                            if(ProtectedKing(sq,sq+EngineColor[j])==Bool.True){

                                if(PieceIsOnSq(sq+EngineColor[j],$(this).position().top,$(this).position().left)==Bool.True){

                                    $(this).addClass("SqAttacked");
                                }
                            }
                        }
                    }
                }
            }
        }

        else if(Colors[IndexColorOfPlayer]==COLOURS.BLACK){

            for(index=(piyonlar.length)/2;index<piyonlar.length ;index++){

                if(clickedPiece==piyonlar[index]){

                    if (PawnAttackedSqStraightBlack(sq+15)==Bool.True ) {

                        if(ProtectedKing(sq,sq+15)==Bool.True){

                            if(PieceIsOnSq(sq+15,$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }

                    }
                    for(j=0;j<PlayerColor.length;j++){

                        if (PawnAttackedSqDiagonalBlack(sq+PlayerColor[j])==Bool.True ) {

                            if(ProtectedKing(sq,sq+PlayerColor[j])==Bool.True){

                                if(PieceIsOnSq(sq+PlayerColor[j],$(this).position().top,$(this).position().left)==Bool.True){

                                    $(this).addClass("SqAttacked");
                                }
                            }

                        }
                    }
                }
            }

            for(index=0;index<(piyonlar.length)/2;index++){

                if(clickedPiece==piyonlar[index]){

                    if (PawnAttackedSqStraightWhite(sq-15)==Bool.True ) {

                        if(ProtectedKing(sq,sq-15)==Bool.True){

                            if(PieceIsOnSq(sq-15,$(this).position().top,$(this).position().left)==Bool.True){

                                $(this).addClass("SqAttacked");
                            }
                        }
                    }

                    for(j=0;j<EngineColor.length;j++){

                        if (PawnAttackedSqDiagonalWhite(sq+EngineColor[j])==Bool.True ) {

                            if(ProtectedKing(sq,sq+EngineColor[j])==Bool.True){

                                if(PieceIsOnSq(sq+EngineColor[j],$(this).position().top,$(this).position().left)==Bool.True){

                                    $(this).addClass("SqAttacked");
                                }
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

                                if(ProtectedKing(sq,new_sq)==Bool.True){

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

                            if(ProtectedKing(sq,new_sq)==Bool.True){

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

                                    if(ProtectedKing(sq,new_sq)==Bool.True){

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

                            if(ProtectedKing(sq,new_sq)==Bool.True){

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

                                        if(ProtectedKing(sq,new_sq)==Bool.True){

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

                                if(ProtectedKing(sq,new_sq)==Bool.True){

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


                                        if(ProtectedKing(sq,new_sq)==Bool.True){

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

                                if(ProtectedKing(sq,new_sq)==Bool.True){

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

                        else if( (sq==181 || sq==88) && (GameBoard.pieces[sq] !=PIECES.EMPTY) && PieceColor[GameBoard.pieces[sq]] ==GameBoard.side){

                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {

                            if(new_sq==88 || new_sq==181) continue;

                            if ( PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                if(SqAttacked(new_sq,GameBoard.side^1)==Bool.False){

                                    if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                        PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                        $(this).addClass("SqAttacked");
                                    }
                                }
                            }
                        }

                        else {
                            if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){
                                if (PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE) {

                                    if(new_sq==88) continue;

                                    if(SqAttacked(new_sq,GameBoard.side^1)==Bool.False){

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }


                                } else if (PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK) {

                                    if(new_sq==181) continue;

                                    if(SqAttacked(new_sq,GameBoard.side^1)==Bool.False){

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }
                                }

                            }else if(Colors[IndexColorOfPlayer]==COLOURS.BLACK){

                                if (PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE) {

                                    if(new_sq==181) continue;

                                    if(SqAttacked(new_sq,GameBoard.side^1)==Bool.False){

                                        if(PieceIsOnSq(new_sq,$(this).position().top,$(this).position().left)==Bool.True &&
                                            PieceColor[GameBoard.pieces[sq]] == GameBoard.side){
                                            $(this).addClass("SqAttacked");
                                        }
                                    }

                                } else if (PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK) {

                                    if(new_sq==88) continue;
                                    if(SqAttacked(new_sq,GameBoard.side^1)==Bool.False){

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


