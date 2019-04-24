
function SQOFFBOARD(sq) {
    if(FilesBrd[sq]==SQUARES.OFF_BOARD){
        return Bool.True;
    }
    return Bool.False;
}


function MOVE(from,to ,captured,promoted, flag) {

    return ( from | (to <<8) | (captured <<16) | (promoted<<22) | flag);

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

        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank ) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)) {

            AddCaptureMove(MOVE(from, to, cap, 0, MFLAGTOBEADKING));
        }
        else if( (wPromNumPofP==1 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank  ) ||
            (bPromNumPofP==1 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)  ) {

            AddCaptureMove(MOVE(from,to,cap,0,MFLAGFORK));

        } else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
            (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)) {

            AddCaptureMove(MOVE(from,to,cap,1,0));

        } else {   AddCaptureMove(MOVE(from,to,cap,0,0)); }


    }else{ AddCaptureMove(MOVE(from,to,cap,0,0)); }

}


function AddPawnQuietMove(from,to){

    if(GameBoard.hisPly>11){

        var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)]];
        var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)]];
        var Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        var Previous_from=FROMSQ(Previous_move);
        console.log("wPromNumPofP "+wPromNumPofP);

        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)){

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


function PawnAttackedSqStraightWhite(sq){
    if (GameBoard.pieces[sq] == PIECES.EMPTY  && GameBoard.side==COLOURS.WHITE) {
        if(IsSquareCitadel(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqStraightBlack(sq){
    if (GameBoard.pieces[sq] == PIECES.EMPTY  && GameBoard.side==COLOURS.BLACK) {
        if(IsSquareCitadel(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqDiagonalWhite(sq){

    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.WHITE  && PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK )  {
        if(IsSquareCitadel(sq)==Bool.True){
            return Bool.True;
        }
    }
    return Bool.False;
}

function PawnAttackedSqDiagonalBlack(sq){
    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.BLACK && PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE )  {
        if(IsSquareCitadel(sq)==Bool.True){
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
    console.log("piyonun piyonu "+sq+" nolu karede");

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

    var index;
    var sq;

    var Move2InitPosPofK=MoveToInitPosPawnofKing();
    var escapeKing=SwitchPlaceOfKing();
    var escapeAdKing=AdKingMoveFromCitadel();
    var move2Fork=MovetoFork();


    if(move2Fork==Bool.False && Move2InitPosPofK==Bool.False && escapeKing==Bool.False && escapeAdKing==Bool.False){

        highRankingPiecesMove();
    }
    if(move2Fork==Bool.True){

        ForkingList();
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
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
    }




}


function AdKingMoveFromCitadel() {


    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];
    var new_sq;
    var index;


    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) index=1; else index=-1;

    if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteHighestRanKING==PIECES.WmaceraciSah && WsqOfKing==WsideCitadel){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        new_sq=WpOfpInitSq;

        while(1){

            if(SqAttacked(new_sq,COLOURS.BLACK)==Bool.False){

                AddQuietMove(MOVE(WsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGMOVEADKINGFROMCITADEL));

                return new_sq;
            }

            new_sq+=index;
        }
    }else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackHighestRanKING==PIECES.BmaceraciSah && BsqOfKing==BsideCitadel){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

        new_sq=BpOfpInitSq;

        while(1){
            if(SqAttacked(new_sq,COLOURS.BLACK)==Bool.False){

                AddQuietMove(MOVE(BsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGMOVEADKINGFROMCITADEL));

                return new_sq;
            }
            new_sq-=index;
        }
    }

    return Bool.False;
}



function SwitchPlaceOfKing() {


    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];
    var index,new_sq,pce;

    if(GameBoard.side==COLOURS.WHITE && WsqOfKing==BsideCitadel && GameBoard.WhiteKingsInGame.length>1){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

        for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){

            pce=GameBoard.WhiteKingsInGame[index];
            if(pce==GameBoard.WhiteHighestRanKING) continue;
            new_sq=GameBoard.pList[PCEINDEX(pce,0)];
            AddQuietMove(MOVE(WsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGSWITCHKING));

        }
        return Bool.True;

    }else if(GameBoard.side==COLOURS.BLACK && BsqOfKing==WsideCitadel && GameBoard.BlackKingsInGame.length>1){

        for(index=0;index<GameBoard.BlackKingsInGame.length;index++){

            pce=GameBoard.BlackKingsInGame[index];
            if(pce==GameBoard.BlackHighestRanKING) continue;

            new_sq=GameBoard.pList[PCEINDEX(pce,0)];
            AddQuietMove(MOVE(BsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGSWITCHKING));
        }
        return Bool.True;
    }

    return Bool.False;
}


function MoveToInitPosPawnofKing() {


    var Wsq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
    var Bsq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];
    var Previous_move;
    var Previous_from;
    var sq;

    console.log("wPromNumPofP "+wPromNumPofP+" Wsq: "+Wsq+" side "+GameBoard.side);

    if(wPromNumPofP==2 && RanksBrd[Wsq]==WpromotionRank && GameBoard.side==COLOURS.WHITE){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==WfromRank){

            console.log("Previous_from "+Previous_from);

            sq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];

            if(GameBoard.pieces[WinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,WinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
            else AddCaptureMove(MOVE(sq,WinitSqPofK,GameBoard.pieces[WinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));

            return Bool.True;

        }
    } else if(bPromNumPofP==2 && RanksBrd[Bsq]==BpromotionRank && GameBoard.side==COLOURS.BLACK){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==BfromRank){

            sq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];

            if(GameBoard.pieces[BinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,BinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
            else AddCaptureMove(MOVE(sq,BinitSqPofK,GameBoard.pieces[BinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));

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
    var j;
    console.log("GameBoard.moveListStart[GameBoard.ply + 1] "+GameBoard.moveListStart[GameBoard.ply + 1]);
    console.log("GameBoard.moveListStart[GameBoard.ply] "+GameBoard.moveListStart[GameBoard.ply]);
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];


    for(index=0;index<WhitePawns.length;index++){
        sq = GameBoard.pList[PCEINDEX(WhitePawns[index], 0)];

        if (PawnAttackedSqStraightWhite(sq+PawnsFowards) == Bool.True ) {

            AddPawnQuietMove(sq,sq+PawnsFowards);
        }

        for(j=0;j<PawnDiagonal.length;j++){

            if (PawnAttackedSqDiagonalWhite(sq+PawnDiagonal[j]) == Bool.True ) {

                AddPawnCaptureMove(sq,sq+PawnDiagonal[j],GameBoard.pieces[sq + PawnDiagonal[j]]);
            }
        }
    }

    for(index=0;index<BlackPawns.length;index++){
        sq = GameBoard.pList[PCEINDEX(BlackPawns[index], 0)];


        if (PawnAttackedSqStraightBlack(sq-PawnsFowards) == Bool.True) {

            AddPawnQuietMove(sq,sq-PawnsFowards);
        }

        for(j=0;j<PawnDiagonal.length;j++){

            if (PawnAttackedSqDiagonalBlack(sq-PawnDiagonal[j]) == Bool.True) {

                AddPawnCaptureMove(sq,sq-PawnDiagonal[j],GameBoard.pieces[sq-PawnDiagonal[j]]);
            }
        }
    }

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

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];

                new_sq = sq + Direction;

                if (SQOFFBOARD(new_sq) == Bool.True) {

                    continue;
                }

                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                    if(PieceColor[GameBoard.pieces[sq]]== COLOURS.WHITE && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.BLACK){



                        if( (new_sq==WsideCitadel && GameBoard.pieces[sq]!=PIECES.WmaceraciSah) ||
                            (new_sq==BsideCitadel && GameBoard.pieces[sq]!=GameBoard.WhiteHighestRanKING) ){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.WHITE){

                        if( (new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BmaceraciSah) ||
                            (new_sq==WsideCitadel && GameBoard.pieces[sq]!=GameBoard.BlackHighestRanKING) ){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                }
                else {
                    if(PieceColor[GameBoard.pieces[sq]]== COLOURS.WHITE){

                        if( (new_sq==WsideCitadel  && GameBoard.pieces[sq]!=PIECES.WmaceraciSah) ||
                            (new_sq==BsideCitadel && GameBoard.pieces[sq]!=GameBoard.WhiteHighestRanKING)){

                            continue;
                        }

                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK){

                        if( (new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BmaceraciSah) ||
                            (new_sq==WsideCitadel && GameBoard.pieces[sq]!=GameBoard.BlackHighestRanKING) ){

                            continue;
                        }
                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }
                }
            }
        }
        Pce = LoopKings[PieceIndex++];

    }
}
