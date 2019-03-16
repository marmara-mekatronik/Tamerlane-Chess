
function SQOFFBOARD(sq) {
    if(FilesBrd[sq]==SQUARES.OFF_BOARD){
        return Bool.True;
    }
    return Bool.False;
}


function MOVE(from,to ,captured,promoted, flag) {

    return( from | (to <<8) | (captured <<16) | (promoted<<22) | flag);

}


function AddCaptureMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]]=move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++]=0;
}

function AddQuietMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]]=move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++]=0;
}



function AddPawnCaptureMove(from,to,cap){

    if(GameBoard.hisPly>11){

        var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)]];
        var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)]];
        var Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        var Previous_from=FROMSQ(Previous_move);

        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)) {

            AddCaptureMove(MOVE(from, to, cap, 0, MFLAGTOBEADKING));
        }
        if( (wPromNumPofP==1 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank  ) ||
            (bPromNumPofP==1 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)  ) {

            AddCaptureMove(MOVE(from,to,cap,0,MFLAGFORK));
        }

        else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
            (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)) {

            AddCaptureMove(MOVE(from,to,cap,1,0));
        }else {   AddCaptureMove(MOVE(from,to,cap,0,0)); }


    }else{ AddCaptureMove(MOVE(from,to,cap,0,0)); }

}


function AddPawnQuietMove(from,to){

    if(GameBoard.hisPly>11){

        var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)]];
        var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)]];
        var Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        var Previous_from=FROMSQ(Previous_move);
        console.log("wPromNumPofP "+wPromNumPofP);

        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank  && GameBoard.side==COLOURS.WHITE ) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank && GameBoard.side==COLOURS.BLACK)){

            AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,MFLAGTOBEADKING));
        }
        else if( (wPromNumPofP==1 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank && GameBoard.WforkList.length>0) ||
            (bPromNumPofP==1 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank && GameBoard.BforkList.length>0) ){

            AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,MFLAGFORK));

        }else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
            (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)){

            AddQuietMove(MOVE(from,to,PIECES.EMPTY,1,0));

        }else{   AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,0)); }

    }else AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,0));

}



function KingsInGame(PromPiece) {

    switch (PromPiece) {

        case PIECES.Wprens:GameBoard.WhiteKingsInGame[1]=PIECES.Wprens; GameBoard.WhiteNumberOfKingsInGame++; break;

        case PIECES.WmaceraciSah:  GameBoard.WhiteKingsInGame[2]=PIECES.WmaceraciSah;  GameBoard.WhiteNumberOfKingsInGame++; break;

        case PIECES.Bprens:  GameBoard.BlackKingsInGame[1]=PIECES.Bprens;  GameBoard.BlackNumberOfKingsInGame++; break;

        case PIECES.BmaceraciSah:   GameBoard.BlackKingsInGame[2]=PIECES.BmaceraciSah;  GameBoard.BlackNumberOfKingsInGame++; break;

    }

}



function PawnAttackedSqStraightWhite(sq){
    if (GameBoard.pieces[sq] == PIECES.EMPTY  && GameBoard.side==COLOURS.WHITE) {
        if(DontMoveExtraSquares(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqStraightBlack(sq){
    if (GameBoard.pieces[sq] == PIECES.EMPTY  && GameBoard.side==COLOURS.BLACK) {
        if(DontMoveExtraSquares(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqDiagonalWhite(sq){

    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.WHITE  && PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK )  {
        if(DontMoveExtraSquares(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqDiagonalBlack(sq){
    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.BLACK && PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE )  {
        if(DontMoveExtraSquares(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}


function ForkingList() {

    var rank,file,Windex=0,Bindex=0,sq,sq1,sq2,Wdiagonal,Bdiagonal,fork_sq;

    for(rank=Ranks.Rank_1;rank<=Ranks.Rank_10;rank++){

        for(file=Files.Files_1;file<=Files.Files_11;file++){

            sq=FR2SQ(file,rank);

            if (PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE){
                GameBoard.WpceList[Windex] = sq;
                Windex++;
            } else if(PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK){
                GameBoard.BpceList[Bindex]= sq;
                Bindex++;
            }
        }
    }

    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){

        Wdiagonal=16;
        Bdiagonal=-14;
    }else{
        Wdiagonal=-14;
        Bdiagonal=16;
    }

    Windex=0;
    Bindex=0;
    var index;

    for(index=0;index<GameBoard.BpceList.length;index++){

        sq=GameBoard.BpceList[index];
        sq1=GameBoard.BpceList[index+1]-2;
        sq2=GameBoard.BpceList[index+2]-2;

        if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.BpceList[index+1]-Wdiagonal;
        else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.BpceList[index+2]-Wdiagonal;
        else continue;


        if(RanksBrd[fork_sq]!=SQUARES.OFF_BOARD){

            if(GameBoard.BlackOnlyKingInGame!=0 && GameBoard.pieces[fork_sq]==GameBoard.BlackOnlyKingInGame) continue;

            GameBoard.WforkList[Windex]=fork_sq;
            Windex++;
        }
    }

    for(index=0;index<GameBoard.WpceList.length;index++) {

        sq=GameBoard.WpceList[index];
        sq1=GameBoard.WpceList[index + 1] - 2;
        sq2=GameBoard.WpceList[index + 2] - 2;

        if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.WpceList[index+1]-Bdiagonal;
        else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.WpceList[index+2]-Bdiagonal;
        else continue;


        if (RanksBrd[fork_sq] != SQUARES.OFF_BOARD) {
            if (GameBoard.WhiteOnlyKingInGame != 0 && GameBoard.pieces[fork_sq] == GameBoard.WhiteOnlyKingInGame) continue;

            GameBoard.BforkList[Bindex]=fork_sq;
            Bindex++;
        }

    }
}



function MovetoFork() {

    var sq;
    var Previous_move;
    var Previous_from;

    sq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];

    if(wPromNumPofP==1 && RanksBrd[sq]==WpromotionRank && GameBoard.side==COLOURS.WHITE ){

        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==WfromRank){

            return Bool.True;
        }
    }


    sq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];

    if(bPromNumPofP==1 && RanksBrd[sq]==BpromotionRank && GameBoard.side==COLOURS.BLACK){

        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==BfromRank){

           return Bool.True;
        }
    }

    return Bool.False;
}



function  GenerationMoves() {

    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    var PieceNumber;
    var sq;
    var index;
    var j;


    for(index=0;index<piyonlar.length;index++){
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[piyonlar[index]]; ++PieceNumber) {

            sq = GameBoard.pList[PCEINDEX(piyonlar[index], PieceNumber)];


            if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){

                if (PawnAttackedSqStraightWhite(sq+15) == Bool.True ) {

                    AddPawnQuietMove(sq,sq+15);
                }

                if (PawnAttackedSqStraightBlack(sq-15) == Bool.True) {

                    AddPawnQuietMove(sq,sq-15);
                }

                for(j=0;j<PlayerColor.length;j++){

                    if (PawnAttackedSqDiagonalWhite(sq+PlayerColor[j]) == Bool.True ) {

                        AddPawnCaptureMove(sq,sq+PlayerColor[j],GameBoard.pieces[sq + PlayerColor[j]]);
                    }

                    if (PawnAttackedSqDiagonalBlack(sq+EngineColor[j]) == Bool.True) {

                        AddPawnCaptureMove(sq,sq+EngineColor[j],GameBoard.pieces[sq +EngineColor[j]]);
                    }
                }
            }

            else if(Colors[IndexColorOfPlayer]==COLOURS.BLACK){



                if (PawnAttackedSqStraightWhite(sq-15) == Bool.True ) {

                    AddPawnQuietMove(sq,sq-15);
                }

                if (PawnAttackedSqStraightBlack(sq+15) == Bool.True) {

                    AddPawnQuietMove(sq,sq+15);
                }

                for(j=0;j<PlayerColor.length;j++){

                    if (PawnAttackedSqDiagonalWhite(sq+EngineColor[j]) == Bool.True ) {

                        AddPawnCaptureMove(sq,sq+EngineColor[j],GameBoard.pieces[sq + EngineColor[j]]);
                    }

                    if (PawnAttackedSqDiagonalBlack(sq+PlayerColor[j]) == Bool.True) {

                        AddPawnCaptureMove(sq,sq+PlayerColor[j],GameBoard.pieces[sq +PlayerColor[j]]);
                    }
                }
            }
        }
    }

    var forking=MovetoFork();
    var initposPofK=MoveToInitPosPawnofKing();

    if(forking==Bool.False && initposPofK==Bool.False){

        highRankingPiecesMove();

    }else if(forking==Bool.True){

        ForkingList();

        console.log(GameBoard.WforkList);

        sq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];

        var fork_sq;

        for(index=0;index<GameBoard.WforkList.length;index++) {

            fork_sq = GameBoard.WforkList[index];

            if (GameBoard.pieces[fork_sq] != PIECES.EMPTY) {

                AddPawnCaptureMove(sq,fork_sq,GameBoard.pieces[fork_sq]);

            } else {
                AddPawnQuietMove(sq,fork_sq);
            }
        }

        sq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];

        for(index=0;index<GameBoard.BforkList.length;index++){

            fork_sq=GameBoard.BforkList[index];

            if(GameBoard.pieces[fork_sq]!=PIECES.EMPTY){

                AddPawnCaptureMove(sq,fork_sq,GameBoard.pieces[fork_sq]);

            }else{
                AddPawnQuietMove(sq,fork_sq);

            }
        }
    }else if(initposPofK==Bool.True){

        if(GameBoard.side==COLOURS.WHITE){

            sq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
            if(GameBoard.pieces[BinitSqPofK]!=PIECES.EMPTY) AddCaptureMove(MOVE(sq,BinitSqPofK,GameBoard.pieces[BinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));
            else if(GameBoard.pieces[BinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,BinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
        }else{

            sq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];
            if(GameBoard.pieces[WinitSqPofK]!=PIECES.EMPTY) AddCaptureMove(MOVE(sq,WinitSqPofK,GameBoard.pieces[WinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));
            else if(GameBoard.pieces[WinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,BinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));

        }
    }
   // console.log("MoveToInitPosPawnofKing()  "+MoveToInitPosPawnofKing());

}

function MoveToInitPosPawnofKing() {

    var Wsq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
    var Bsq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];
    var Previous_move;
    var Previous_from;

    console.log("wPromNumPofP "+wPromNumPofP+" RanksBrd[Wsq]  "+RanksBrd[Wsq]+" Wsq "+Wsq+"  WpromotionRank  "+WpromotionRank);


    if(wPromNumPofP==2 && RanksBrd[Wsq]==WpromotionRank && GameBoard.side==COLOURS.WHITE){

        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==WfromRank){

            return Bool.True;

        }
    } else if(bPromNumPofP==2 && RanksBrd[Bsq]==BpromotionRank && GameBoard.side==COLOURS.BLACK){

        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==BfromRank){

            return Bool.True;

        }
    }

    return Bool.False;
}


function highRankingPiecesMove() {

    var PieceIndex;
    var Pce;
    var new_sq;
    var Direction;
    var sq;
    var PieceNumber;
    var index;

    PieceIndex = LoopNonSlideIndex[GameBoard.side];
    Pce = LoopNonSlidePieces[PieceIndex];

    while (Pce != 0) {

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];

                new_sq = sq + Direction;

                if (SQOFFBOARD(new_sq) == Bool.True) {

                    continue;
                }

                if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                    continue;
                }

                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                    if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                } else {
                    AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                }
            }
        }
        Pce = LoopNonSlidePieces[PieceIndex++];
    }

    PieceIndex = LoopSlideKaleIndex[GameBoard.side];
    Pce = LoopSlideKale[PieceIndex];

    while (Pce != 0) {
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                while (SQOFFBOARD(new_sq) == Bool.False) {

                    if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                        new_sq += Direction;
                        continue;
                    }

                    if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                        if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                            AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                        }
                        break;
                    }

                    AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                    new_sq += Direction;
                }
            }
        }
        Pce = LoopSlideKale[PieceIndex++];
    }

    PieceIndex = LoopSlideMancinikIndex[GameBoard.side];
    Pce = LoopSlideMancinik[PieceIndex];

    while (Pce != 0) {
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                if(GameBoard.pieces[sq+GENERAL_direction[index]]==PIECES.EMPTY){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                            new_sq += GENERAL_direction[index];
                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {

                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                        new_sq += GENERAL_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideMancinik[PieceIndex++];
    }

    PieceIndex = LoopSlideZurafaIndex[GameBoard.side];
    Pce = LoopSlideZurafa[PieceIndex];

    while(Pce !=0){

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for(index=0;index<DirectionNumber[Pce];index++){

                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                if(GameBoard.pieces[sq+ZURAFA3_direction[index]]==PIECES.EMPTY && GameBoard.pieces[sq+AT_direction[index]]==PIECES.EMPTY &&
                    GameBoard.pieces[sq+DEVE_direction[index]]==PIECES.EMPTY ){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WsideCitadel || new_sq==WopponetCitadel){

                            new_sq += ZURAFA2_direction[index];
                            continue;
                        }


                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));
                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                        new_sq += ZURAFA2_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideZurafa[PieceIndex++];
    }

    PieceIndex = LoopKingsIndex[GameBoard.side];
    Pce = LoopKings[PieceIndex];

    while (Pce != 0) {

        console.log("Pce   "+Pce);

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];

                new_sq = sq + Direction;
                console.log(LoopKings);
                if(Pce==PIECES.Wprens){
                    console.log("new_sq   "+new_sq);
                    console.log("GameBoard.pList[PCEINDEX(PIECES.Wprens,1)] "+GameBoard.pList[PCEINDEX(PIECES.Wprens,1)]);
                    console.log("GameBoard.pieces[205] "+GameBoard.pieces[205]);
                }

                if (SQOFFBOARD(new_sq) == Bool.True) {

                    continue;
                }


                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                    if(PieceColor[GameBoard.pieces[sq]]== COLOURS.WHITE && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.BLACK){


                        if(new_sq==WsideCitadel && GameBoard.pieces[sq]!=PIECES.WmaceraciSah){
                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.WHITE){

                        if(new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BmaceraciSah){
                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                }
                else {
                    if(PieceColor[GameBoard.pieces[sq]]== COLOURS.WHITE){

                        if(new_sq==WsideCitadel  && GameBoard.pieces[sq]!=PIECES.WmaceraciSah){

                            continue;
                        }

                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK){

                        if(new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BmaceraciSah){

                            continue;
                        }
                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }
                }
            }
        }
        Pce = LoopKings[PieceIndex++];
        console.log("PcePcePcePcePcePcePcePcePcePcePcePce "+Pce);
    }
}

