
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

        var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]];
        var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]];
        var Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        var Previous_from=FROMSQ(Previous_move);

        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank ) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)) {

            AddCaptureMove(MOVE(from, to, cap, 0, MFLAGTOBEADKING));
        }

        else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
            (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)) {

            AddCaptureMove(MOVE(from,to,cap,1,0));

        } else {   AddCaptureMove(MOVE(from,to,cap,0,0)); }


    }else{ AddCaptureMove(MOVE(from,to,cap,0,0)); }

}


function AddPawnQuietMove(from,to){

    if(GameBoard.hisPly>11){

        var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]];
        var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]];
        var Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        var Previous_from=FROMSQ(Previous_move);


        if((wPromNumPofP==2 && RanksBrd[Previous_from]==WfromRank && WpiyonP_rank==WpromotionRank) ||
            (bPromNumPofP==2 && RanksBrd[Previous_from]==BfromRank && BpiyonP_rank==BpromotionRank)){

            AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,MFLAGTOBEADKING));
        }
        else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
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

function SoleKingSwitchPlaceWithAnyPiece() {
    var piece,sq,index;
    var WsqOfsoleKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfsoleKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];

    if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteOnlyKingInGame!=0 &&
        SqAttacked(WsqOfsoleKing,GameBoard.side^1)==Bool.True && WsoleKingSwitchPlacePiece==0){

        for(index=0;index<110;index++){

            sq=SQ342(index);

            piece=GameBoard.pieces[sq];

            if(PieceColor[piece]==COLOURS.WHITE && SqAttacked(sq,GameBoard.side^1)==Bool.False){

                AddQuietMove(MOVE(WsqOfsoleKing,sq,PIECES.EMPTY,0,MFLAGSWITCHANYPIECE));

            }
        }
    }

    else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackOnlyKingInGame!=0 &&
        SqAttacked(BsqOfsoleKing,GameBoard.side^1)==Bool.True && BsoleKingSwitchPlacePiece==0){

        for(index=0;index<110;index++){

            sq=SQ342(index);

            piece=GameBoard.pieces[sq];

            if(PieceColor[piece]==COLOURS.BLACK && SqAttacked(sq,GameBoard.side^1)==Bool.False){

                AddQuietMove(MOVE(BsqOfsoleKing,sq,PIECES.EMPTY,0,MFLAGSWITCHANYPIECE));

            }
        }
    }
}



function ForkingAndImmobile() {


    var WsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];
    var rank,file,Windex=0,Bindex=0,sq,sq1,sq2,diagonal,fork_sq;
    var index;
    var PceList;
    var piece;
    var ImmobilePceList=[];
    var movingPceList=[];
    var move;


    var WsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
    var BsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];

    if(wPromNumPofP==1 && RanksBrd[WsqOfPofP]==WpromotionRank &&
        GameBoard.side==COLOURS.WHITE && SqAttacked(WsqOfOnlyKing,COLOURS.BLACK)==Bool.False){


        for(rank=Ranks.Rank_1;rank<=Ranks.Rank_10;rank++){

            for(file=Files.Files_1;file<=Files.Files_11;file++){

                sq=FR2SQ(file,rank);

                if(PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK){

                    GameBoard.BpceList[Bindex]= sq;
                    Bindex++;
                }
            }
        }

        if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) diagonal=16;

        else diagonal=-14;


        for(index=0;index<GameBoard.BpceList.length;index++){

            sq=GameBoard.BpceList[index];
            sq1=GameBoard.BpceList[index+1]-2;
            sq2=GameBoard.BpceList[index+2]-2;


            if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.BpceList[index+1]-diagonal;
            else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.BpceList[index+2]-diagonal;
            else continue;


            if(RanksBrd[fork_sq]!=SQUARES.OFF_BOARD && GameBoard.pieces[fork_sq]!=GameBoard.BlackOnlyKingInGame){

                if (GameBoard.pieces[fork_sq] != PIECES.EMPTY ) {

                    console.log("fork_sq: "+fork_sq);
                    AddCaptureMove(MOVE(WsqOfPofP,fork_sq,GameBoard.pieces[fork_sq],PIECES.EMPTY,0));

                }
                else {

                    AddQuietMove(MOVE(WsqOfPofP,fork_sq,PIECES.EMPTY,PIECES.EMPTY,0));
                }

            }
        }

        for(index=GameBoard.moveListStart[GameBoard.ply-1];
            index<GameBoard.moveListStart[GameBoard.ply];index++){

            move=GameBoard.moveList[index];

            if(movingPceList.indexOf(FROMSQ(move))==-1) {

                movingPceList.push(FROMSQ(move));

            }
        }

        console.log("tüm taşlar "+GameBoard.BpceList);
        console.log("hareket eden taşlar "+movingPceList);

        PceList=GameBoard.BpceList.concat(movingPceList);

        console.log(PceList);


        for(index=0;index<GameBoard.BpceList.length;index++){

            piece=PceList[index];
            if(PceList.indexOf(piece)==PceList.lastIndexOf(piece)){

                ImmobilePceList.push(piece)
            }

        }

        console.log(ImmobilePceList);

        for(index=0;index<ImmobilePceList.length;index++){

            for(j=0;j<PawnDiagonal.length;j++){

                ImmobileSq=ImmobilePceList[index]-PawnDiagonal[j];

                if(ImmobileSq!=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)] && ImmobileSq!=WsideCitadel && ImmobileSq!=BsideCitadel){

                    if(GameBoard.pieces[ImmobileSq]==PIECES.EMPTY) AddQuietMove(MOVE(WsqOfPofP,ImmobileSq,PIECES.EMPTY,PIECES.EMPTY,0));
                    else AddCaptureMove(MOVE(WsqOfPofP,ImmobileSq,GameBoard.pieces[ImmobileSq],PIECES.EMPTY,0));
                }

            }
        }

    }

    else if(bPromNumPofP==1 && RanksBrd[BsqOfPofP]==BpromotionRank &&
        GameBoard.side==COLOURS.BLACK && SqAttacked(BsqOfOnlyKing,GameBoard.side^1)==Bool.False){


        for(rank=Ranks.Rank_1;rank<=Ranks.Rank_10;rank++){

            for(file=Files.Files_1;file<=Files.Files_11;file++){

                sq=FR2SQ(file,rank);

                if(PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE){

                    GameBoard.WpceList[Windex]=sq;
                    Windex++;
                }
            }
        }

        if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) diagonal=14;

        else diagonal=-16;


        for(index=0;index<GameBoard.WpceList.length;index++){

            sq=GameBoard.WpceList[index];
            sq1=GameBoard.WpceList[index+1]-2;
            sq2=GameBoard.WpceList[index+2]-2;


            if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.WpceList[index+1]+diagonal;
            else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.WpceList[index+2]+diagonal;
            else continue;


             if(RanksBrd[fork_sq]!=SQUARES.OFF_BOARD && GameBoard.pieces[fork_sq]!=GameBoard.WhiteOnlyKingInGame){

                 if (GameBoard.pieces[fork_sq] != PIECES.EMPTY) {


                     AddCaptureMove(MOVE(BsqOfPofP,fork_sq,GameBoard.pieces[fork_sq],PIECES.EMPTY,0));
                 }
                 else {
                     AddQuietMove(MOVE(BsqOfPofP,fork_sq,PIECES.EMPTY,PIECES.EMPTY,0));
                 }

             }
        }


        for(index=GameBoard.moveListStart[GameBoard.ply-1];
            index<GameBoard.moveListStart[GameBoard.ply];index++){

            move=GameBoard.moveList[index];

            if(movingPceList.indexOf(FROMSQ(move))==-1) {

                movingPceList.push(FROMSQ(move));
            }
        }

        console.log("tüm taşlar "+GameBoard.WpceList);
        console.log("hareket eden taşlar "+movingPceList);

        PceList=GameBoard.WpceList.concat(movingPceList);


        console.log(PceList);


        for(index=0;index<GameBoard.WpceList.length;index++){

            piece=PceList[index];
            if(PceList.indexOf(piece)==PceList.lastIndexOf(piece)){

                ImmobilePceList.push(piece)
            }

        }

        console.log(ImmobilePceList);
        var j,ImmobileSq;

        for(index=0;index<ImmobilePceList.length;index++){

            for(j=0;j<PawnDiagonal.length;j++){

                ImmobileSq=ImmobilePceList[index]+PawnDiagonal[j];

                if(ImmobileSq!=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)] && ImmobileSq!=WsideCitadel && ImmobileSq!=BsideCitadel){

                    if(GameBoard.pieces[ImmobileSq]==PIECES.EMPTY) AddQuietMove(MOVE(BsqOfPofP,ImmobileSq,PIECES.EMPTY,PIECES.EMPTY,0));
                    else AddCaptureMove(MOVE(BsqOfPofP,ImmobileSq,GameBoard.pieces[ImmobileSq],PIECES.EMPTY,0));
                }

            }
        }

    }


}


function  GenerationMoves() {


    var Move2InitPosPofK=MoveToInitPosPawnofKing();
    var escapeKing=SwitchPlaceOfKing();
    var escapeAdKing=AdKingMoveFromCitadel();

    if(Move2InitPosPofK==Bool.False && escapeKing==Bool.False && escapeAdKing==Bool.False){

        PiecesMoveGen();
        SoleKingSwitchPlaceWithAnyPiece();
        ForkingAndImmobile();

    }

}


function AdKingMoveFromCitadel() {


    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];
    var new_sq;
    var index;


    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) index=1; else index=-1;

    if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteHighestRanKING==PIECES.WadKing && WsqOfKing==WsideCitadel){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        new_sq=WpOfpInitSq;

        while(1){

            if(SqAttacked(new_sq,COLOURS.BLACK)==Bool.False){

                AddQuietMove(MOVE(WsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGMOVEADKINGFROMCITADEL));

                return new_sq;
            }

            new_sq+=index;
        }
    }else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackHighestRanKING==PIECES.BadKing && BsqOfKing==BsideCitadel){
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
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
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


    var Wsq=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
    var Bsq=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];
    var WsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];
    var Previous_move;
    var Previous_from;
    var sq;

    if(wPromNumPofP==2 && RanksBrd[Wsq]==WpromotionRank &&
        GameBoard.side==COLOURS.WHITE && SqAttacked(WsqOfOnlyKing,GameBoard.side^1)==Bool.False){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==WfromRank){

            console.log("Previous_from "+Previous_from);

            sq=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];

            if(GameBoard.pieces[WinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,WinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
            else AddCaptureMove(MOVE(sq,WinitSqPofK,GameBoard.pieces[WinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));

            return Bool.True;

        }
    } else if(bPromNumPofP==2 && RanksBrd[Bsq]==BpromotionRank &&
        GameBoard.side==COLOURS.BLACK && SqAttacked(BsqOfOnlyKing,GameBoard.side^1)==Bool.False){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        Previous_move=GameBoard.history[GameBoard.hisPly-2].move;
        Previous_from=FROMSQ(Previous_move);

        if(RanksBrd[Previous_from]==BfromRank){

            sq=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];

            if(GameBoard.pieces[BinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(sq,BinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
            else AddCaptureMove(MOVE(sq,BinitSqPofK,GameBoard.pieces[BinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));

            return Bool.True;

        }
    }

    return Bool.False;
}


function PiecesMoveGen() {

    var PieceIndex;
    var Pce;
    var new_sq;
    var Direction;
    var sq;
    var PieceNumber;
    var index;
    var j;
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    if(GameBoard.side==COLOURS.WHITE){

        for(index=0;index<WhitePawns.length;index++){
            for(PieceNumber=0;PieceNumber<GameBoard.piecesNUMBER[WhitePawns[index]];++PieceNumber){

                sq = GameBoard.pList[PCEINDEX(WhitePawns[index], PieceNumber)];


                if (PawnAttackedSqStraightWhite(sq+PawnsFowards) == Bool.True ) {

                    AddPawnQuietMove(sq,sq+PawnsFowards);
                }

                for(j=0;j<PawnDiagonal.length;j++){

                    if (PawnAttackedSqDiagonalWhite(sq+PawnDiagonal[j]) == Bool.True ) {

                        AddPawnCaptureMove(sq,sq+PawnDiagonal[j],GameBoard.pieces[sq + PawnDiagonal[j]]);
                    }
                }

            }

        }
    }

    else{

        for(index=0;index<BlackPawns.length;index++){

            for(PieceNumber=0;PieceNumber<GameBoard.piecesNUMBER[BlackPawns[index]];++PieceNumber){

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

                if (SQOFFBOARD(new_sq) == Bool.True || new_sq==WopponetCitadel || new_sq==WsideCitadel) {

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

    PieceIndex = LoopSlideRookIndex[GameBoard.side];
    Pce = LoopSlideRook[PieceIndex];

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
        Pce = LoopSlideRook[PieceIndex++];
    }

    PieceIndex = LoopSlideCatapultIndex[GameBoard.side];
    Pce = LoopSlideCatapult[PieceIndex];

    while (Pce != 0) {
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                if(GameBoard.pieces[sq+Minister_direction[index]]==PIECES.EMPTY){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                            new_sq += Minister_direction[index];
                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {

                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                        new_sq += Minister_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideCatapult[PieceIndex++];
    }

    PieceIndex = LoopSlideGiraffeIndex[GameBoard.side];
    Pce = LoopSlideGiraffe[PieceIndex];

    while(Pce !=0){

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for(index=0;index<DirectionNumber[Pce];index++){

                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                if(GameBoard.pieces[sq+Giraffe3_direction[index]]==PIECES.EMPTY && GameBoard.pieces[sq+Knight_direction[index]]==PIECES.EMPTY &&
                    GameBoard.pieces[sq+Camel_direction[index]]==PIECES.EMPTY ){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WsideCitadel || new_sq==WopponetCitadel){

                            new_sq += Giraffe2_direction[index];
                            continue;
                        }


                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));
                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                        new_sq += Giraffe2_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideGiraffe[PieceIndex++];
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



                        if( (new_sq==WsideCitadel && GameBoard.pieces[sq]!=PIECES.WadKing) ||
                            (new_sq==BsideCitadel && GameBoard.pieces[sq]!=GameBoard.WhiteHighestRanKING) ){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.WHITE){

                        if( (new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BadKing) ||
                            (new_sq==WsideCitadel && GameBoard.pieces[sq]!=GameBoard.BlackHighestRanKING) ){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                }
                else {
                    if(PieceColor[GameBoard.pieces[sq]]== COLOURS.WHITE){

                        if( (new_sq==WsideCitadel  && GameBoard.pieces[sq]!=PIECES.WadKing) ||
                            (new_sq==BsideCitadel && GameBoard.pieces[sq]!=GameBoard.WhiteHighestRanKING)){

                            continue;
                        }

                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }else if(PieceColor[GameBoard.pieces[sq]]== COLOURS.BLACK){

                        if( (new_sq==BsideCitadel && GameBoard.pieces[sq]!=PIECES.BadKing) ||
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

