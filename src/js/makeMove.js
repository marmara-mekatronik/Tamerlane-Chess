

function  ClearPiece(sq) {

    var pce=GameBoard.pieces[sq];
    var color=PieceColor[pce];
    var index;
    var t_pceNum=-1;

    HASH_PCE(pce,sq);


    GameBoard.pieces[sq]=PIECES.EMPTY;


    for(index=0;index<GameBoard.piecesNUMBER[pce];index++){

        if(GameBoard.pList[PCEINDEX(pce,index)]==sq){
            t_pceNum=index;
            break;

        }
    }
    GameBoard.piecesNUMBER[pce]--;
    GameBoard.pList[PCEINDEX(pce,t_pceNum)]=GameBoard.pList[PCEINDEX(pce, GameBoard.piecesNUMBER[pce])];

}


function AddPiece(sq,pce) {

    var color=PieceColor[pce];
    HASH_PCE(pce,sq);

    GameBoard.pieces[sq]=pce;
    GameBoard.pList[PCEINDEX(pce,GameBoard.piecesNUMBER[pce])]=sq;
    GameBoard.piecesNUMBER[pce]++;

}


function  MovePiece(from,to,move) {

    var index;
    var pce=GameBoard.pieces[from];

    HASH_PCE(pce,from);

    GameBoard.pieces[from]=PIECES.EMPTY;

    if( (move & MFLAGSWITCHKING)!=0){

        GameBoard.pieces[from]=GameBoard.pieces[to];
        GameBoard.pList[PCEINDEX(GameBoard.pieces[from],0)]=from;
    }

    HASH_PCE(pce,to);
    GameBoard.pieces[to]=pce;

    for(index=0;index<GameBoard.piecesNUMBER[pce];index++){

        if(GameBoard.pList[PCEINDEX(pce,index)]==from){

            GameBoard.pList[PCEINDEX(pce,index)]=to;
            break;
        }
    }
}

function ClearKing(piece) {

    var index;

    if(PieceColor[piece]==COLOURS.WHITE){

        for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){
            if(GameBoard.WhiteKingsInGame[index]==piece){
                GameBoard.WhiteKingsInGame.splice(index,1);
                GameBoard.WhiteNumberOfKingsInGame--;
                LoopKingsIndex[1]--;
                LoopKings.splice(0,1);
            }
        }
        if(piece==GameBoard.WhiteHighestRanKING){
            if(GameBoard.WhiteKingsInGame.length==2) GameBoard.WhiteHighestRanKING=PIECES.Wprens;
            else if(GameBoard.WhiteKingsInGame.length==1){

                GameBoard.WhiteHighestRanKING=GameBoard.WhiteKingsInGame[0];
                GameBoard.WhiteOnlyKingInGame=GameBoard.WhiteKingsInGame[0];
            }
        }

    }else{
        for(index=0;index<GameBoard.BlackKingsInGame.length;index++){
            if(GameBoard.BlackKingsInGame[index]==piece){
                GameBoard.BlackKingsInGame.splice(index,1);
                GameBoard.BlackNumberOfKingsInGame--;
                LoopKings.splice(LoopKings.length-2,1);
            }
        }
        if(piece==GameBoard.BlackHighestRanKING){
            if(GameBoard.BlackKingsInGame.length==2) GameBoard.BlackHighestRanKING=PIECES.Bprens;
            else if(GameBoard.BlackKingsInGame.length==1){

                GameBoard.BlackHighestRanKING=GameBoard.BlackKingsInGame[0];
                GameBoard.BlackOnlyKingInGame=GameBoard.BlackKingsInGame[0];
            }
        }
    }
}


function AddKing(promPiece) {

    if(promPiece==PIECES.Wprens || promPiece==PIECES.WmaceraciSah){

        GameBoard.WhiteOnlyKingInGame=PIECES.EMPTY;
        GameBoard.WhiteNumberOfKingsInGame++;
        GameBoard.WhiteKingsInGame.push(promPiece);
        LoopKingsIndex[1]++;
        LoopKings.unshift(promPiece);

    }else if(promPiece==PIECES.Bprens || promPiece==PIECES.BmaceraciSah){

        GameBoard.BlackOnlyKingInGame=PIECES.EMPTY;
        GameBoard.BlackNumberOfKingsInGame++;
        GameBoard.BlackKingsInGame.push(promPiece);
        LoopKings.splice(LoopKings.length-1,2,promPiece,0);
    }
}

function MakeMove(move) {

    var from=FROMSQ(move);
    var to=TOSQ(move);
    var piece=GameBoard.pieces[from];


    var side=GameBoard.side;
    GameBoard.history[GameBoard.hisPly].PosKey=GameBoard.PosKey;
    GameBoard.history[GameBoard.hisPly].move=move;

    var captured=CAPTURED(move);

    if(captured !=PIECES.EMPTY) {

        ClearPiece(to);
        ClearKing(captured);
    }

    GameBoard.hisPly++;
    GameBoard.ply++;

    MovePiece(from,to,move);
    var promotion=PROM(move);


   if(promotion ==Bool.True){

       var PromPce=Promoted(piece);

       ClearPiece(to);
       AddPiece(to,PromPce);
       AddKing(PromPce);

   }

   GameBoard.side ^=1;
   HASH_SIDE();

    var singleKing;
    if(side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length==1){

        singleKing=GameBoard.WhiteOnlyKingInGame;

    }
    else if(side==COLOURS.BLACK && GameBoard.BlackKingsInGame.length==1) {

        singleKing=GameBoard.BlackOnlyKingInGame;
    }
    else singleKing=0;

    console.log("(move & MFLAGMOVEADKINGFROMCITADEL) "+(move & MFLAGMOVEADKINGFROMCITADEL));
    console.log("(move & MFLAGSWITCHKING) "+(move & MFLAGSWITCHKING)+" SwitchPlaceOfKing() "+SwitchPlaceOfKing());
    PrintSqAttacked();



    if(SqAttacked(GameBoard.pList[PCEINDEX(singleKing,0)], GameBoard.side) ){

        TakeMove();
        return Bool.False;
    }else {

        var WsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
        var BsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];
        var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
        var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];

        if((move & MFLAGFORK)!=0 ){

            if(RanksBrd[WsqOfPofP]==WpromotionRank) {
                console.log("white have to move one of the forking square ");
                TakeMove();
                return Bool.False;
            }

            if(RanksBrd[BsqOfPofP]==BpromotionRank){
                console.log("black have to move one of the forking square ");
                TakeMove();
                return Bool.False;
            }
        }
        else if((move & MFLAGTOBEADKING)!=0 ){

            if( (side==COLOURS.WHITE && WsqOfPofP!=WinitSqPofK) ||
                (side==COLOURS.BLACK && BsqOfPofP!=BinitSqPofK)){

                console.log("have to move initial position of pawn of king ");
                TakeMove();
                return Bool.False;

            }
        }else if( (move & MFLAGSWITCHKING)!=0 ){


            console.log("ŞAH KALEDEN AYRILMAK ZORUNDADIR ");

            if( (WsqOfKing==BsideCitadel && side==COLOURS.WHITE) || (BsqOfKing==WsideCitadel && side==COLOURS.BLACK)){
                console.log("have to switch place of kings ");
                TakeMove();
                return Bool.False;
            }
        }else if( (move & MFLAGMOVEADKINGFROMCITADEL)!=0 ){

            console.log("ad king kaleden yarılmak zorunda!");

            if ( (side==COLOURS.WHITE && GameBoard.pList[PCEINDEX(PIECES.WmaceraciSah,0)]==WsideCitadel) ||
                (side==COLOURS.BLACK && GameBoard.pList[PCEINDEX(PIECES.BmaceraciSah,0)]==BsideCitadel) ){

                console.log("ad king have to move from citadel ");
                TakeMove();
                return Bool.False;
            }
        }

    }

    return Bool.True;
}


function TakeMove() {

    GameBoard.ply--;
    GameBoard.hisPly--;

    var move=GameBoard.history[GameBoard.hisPly].move;
    var from=FROMSQ(move);
    var to=TOSQ(move);
    var Pce=GameBoard.pieces[to];

    console.log("Pce  "+Pce);

    GameBoard.side ^=1;
    HASH_SIDE();

    MovePiece(to,from,move);

    var captured=CAPTURED(move);
    var promoted=PROM(move);

    if(captured != PIECES.EMPTY){

        AddPiece(to,captured);
        AddKing(captured);
    }

    if(promoted == Bool.True){

        ClearPiece(from);
        AddPiece(from, TakePromoted(Pce));
        ClearKing(Pce);

    }
}


function TakePromoted(PromPce) {

    var PawnOf;

    switch (PromPce) {

        case PIECES.WpiyonP : PawnOf=PIECES.WpiyonP; break;
        case PIECES.WmaceraciSah:
            PawnOf=PIECES.WpiyonP;
            break;
        case PIECES.Wkale: PawnOf=PIECES.WkaleP; break;
        case PIECES.Wvezir: PawnOf=PIECES.WvezirP; break;
        case PIECES.Wgeneral: PawnOf=PIECES.WgeneralP; break;
        case PIECES.Wat: PawnOf=PIECES.WatP; break;
        case PIECES.Wzurafa: PawnOf=PIECES.WzurafaP; break;
        case PIECES.Wdebbabe: PawnOf=PIECES.WdebbabeP; break;
        case PIECES.Wdeve: PawnOf=PIECES.WdeveP; break;
        case PIECES.Wprens:
            PawnOf=PIECES.WsahP;
            break;
        case PIECES.Wmancinik: PawnOf=PIECES.WmancinikP; break;
        case PIECES.Wfil:  PawnOf=PIECES.WfilP; break;

        case PIECES.BpiyonP:  PawnOf=PIECES.BpiyonP; break;
        case PIECES.BmaceraciSah:
            PawnOf=PIECES.BpiyonP;
            break;
        case PIECES.Bkale: PawnOf=PIECES.BkaleP; break;
        case PIECES.Bvezir: PawnOf=PIECES.BvezirP; break;
        case PIECES.Bgeneral: PawnOf=PIECES.BgeneralP; break;
        case PIECES.Bat: PawnOf=PIECES.BatP; break;
        case PIECES.Bzurafa: PawnOf=PIECES.BzurafaP; break;
        case PIECES.Bdebbabe: PawnOf=PIECES.BdebbabeP; break;
        case PIECES.Bdeve: PawnOf=PIECES.BdeveP; break;
        case PIECES.Bprens:
            PawnOf=PIECES.BsahP;
            break;
        case PIECES.Bmancinik: PawnOf=PIECES.BmancinikP; break;
        case PIECES.Bfil: PawnOf=PIECES.BfilP; break;

    }

    return PawnOf;
}


function Promoted(piece) {

    var PromPiece;

    if(piece==PIECES.WpiyonP && wPromNumPofP==2){
        PromPiece=PIECES.WmaceraciSah;
        GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)]=PIECES.EMPTY;
        return PromPiece;
    }
    else if(piece==PIECES.BpiyonP && bPromNumPofP==2){
        PromPiece=PIECES.BmaceraciSah;
        GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)]=PIECES.EMPTY;
        return PromPiece;
    }


    switch (piece) {

        case PIECES.WpiyonP: PromPiece=PIECES.WpiyonP; break;
        case PIECES.WkaleP: PromPiece=PIECES.Wkale; break;
        case PIECES.WvezirP: PromPiece=PIECES.Wvezir; break;
        case PIECES.WgeneralP: PromPiece=PIECES.Wgeneral; break;
        case PIECES.WatP: PromPiece=PIECES.Wat; break;
        case PIECES.WzurafaP: PromPiece=PIECES.Wzurafa; break;
        case PIECES.WdebbabeP: PromPiece=PIECES.Wdebbabe; break;
        case PIECES.WdeveP: PromPiece=PIECES.Wdeve; break;
        case PIECES.WsahP:
            PromPiece=PIECES.Wprens;
            break;
        case PIECES.WmancinikP: PromPiece=PIECES.Wmancinik; break;
        case PIECES.WfilP:  PromPiece=PIECES.Wfil; break;

        case PIECES.BpiyonP: PromPiece=PIECES.BpiyonP; break;
        case PIECES.BkaleP: PromPiece=PIECES.Bkale; break;
        case PIECES.BvezirP: PromPiece=PIECES.Bvezir; break;
        case PIECES.BgeneralP: PromPiece=PIECES.Bgeneral; break;
        case PIECES.BatP: PromPiece=PIECES.Bat; break;
        case PIECES.BzurafaP: PromPiece=PIECES.Bzurafa; break;
        case PIECES.BdebbabeP: PromPiece=PIECES.Bdebbabe; break;
        case PIECES.BdeveP: PromPiece=PIECES.Bdeve; break;
        case PIECES.BsahP:
            PromPiece=PIECES.Bprens;
            break;
        case PIECES.BmancinikP: PromPiece=PIECES.Bmancinik; break;
        case PIECES.BfilP: PromPiece=PIECES.Bfil; break;

    }

    return PromPiece;
}



