

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
    console.log("GameBoard.pList[PCEINDEX(pce,t_pceNum)] "+GameBoard.pList[PCEINDEX(pce,t_pceNum)]);
    console.log("pce "+pce+"  t_pceNum  "+t_pceNum);
}


function AddPiece(sq,pce) {

    var color=PieceColor[pce];
    HASH_PCE(pce,sq);

    GameBoard.pieces[sq]=pce;
    GameBoard.pList[PCEINDEX(pce,GameBoard.piecesNUMBER[pce])]=sq;
    if(pce==PIECES.Wprens){

        console.log("GameBoard.pList[PCEINDEX(pce,GameBoard.piecesNUMBER[pce])] "+GameBoard.pList[PCEINDEX(pce,GameBoard.piecesNUMBER[pce])]);

    }
    GameBoard.piecesNUMBER[pce]++;

}


function  MovePiece(from,to) {

    var index;
    var pce=GameBoard.pieces[from];

    HASH_PCE(pce,from);

    GameBoard.pieces[from]=PIECES.EMPTY;
    HASH_PCE(pce,to);
    GameBoard.pieces[to]=pce;


    for(index=0;index<GameBoard.piecesNUMBER[pce];index++){

        if(GameBoard.pList[PCEINDEX(pce,index)]==from){

            GameBoard.pList[PCEINDEX(pce,index)]=to;
            break;
        }
    }
}

function MakeMove(move) {

    var from=FROMSQ(move);
    var to=TOSQ(move);
    var piece=GameBoard.pieces[from];
    var pawnofpawn;

    var side=GameBoard.side;
    GameBoard.history[GameBoard.hisPly].PosKey=GameBoard.PosKey;
    GameBoard.history[GameBoard.hisPly].move=move;

    var captured=CAPTURED(move);

    if(captured !=PIECES.EMPTY) {

        ClearPiece(to);
    }

    GameBoard.hisPly++;
    GameBoard.ply++;


    MovePiece(from,to);
    var promotion=PROM(move);


   if(promotion ==Bool.True){

       var PromPce=Promoted(piece);
       ClearPiece(to);
       AddPiece(to,PromPce);
       KingsInGame(PromPce);

   }else if((move & MFLAGFORK)!=0 ){

        (GameBoard.side==COLOURS.WHITE) ? pawnofpawn=PIECES.WpiyonP : pawnofpawn=PIECES.BpiyonP;

        ClearPiece(to);
        AddPiece(to,pawnofpawn);

   }else if((move & MFLAGTOBEADKING)!=0){

       if(GameBoard.side==COLOURS.WHITE){
           ClearPiece(WinitSqPofK);
           AddPiece(WinitSqPofK, PIECES.WpiyonP);

       }else {

           ClearPiece(BinitSqPofK);
           AddPiece(BinitSqPofK, PIECES.BpiyonP);
       }
   }

   GameBoard.side ^=1;
   HASH_SIDE();

    if(SqAttacked(GameBoard.pList[PCEINDEX(Kings[side],0)], GameBoard.side) ){

        TakeMove();
        return Bool.False;
    }else {
        var Wsq=GameBoard.pList[PCEINDEX(PIECES.WpiyonP,0)];
        var Bsq=GameBoard.pList[PCEINDEX(PIECES.BpiyonP,0)];

        if((move & MFLAGFORK)!=0 ){

            if(RanksBrd[Wsq]==WpromotionRank) {
                console.log("white have to move one of the forking square ");
                TakeMove();
                return Bool.False;
            }

            if(RanksBrd[Bsq]==BpromotionRank){
                console.log("black have to move one of the forking square ");
                TakeMove();
                return Bool.False;
            }
        }
        else if((move & MFLAGTOBEADKING)!=0 ){

            if( (side==COLOURS.WHITE && Wsq!=WinitSqPofK) ||
                (side==COLOURS.BLACK && Bsq!=BinitSqPofK)){

                console.log("have to move initial position of pawn of king ");
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

    MovePiece(to,from);


    var captured=CAPTURED(move);
    var promoted=PROM(move);


    if(captured != PIECES.EMPTY){

        AddPiece(to,captured);
    }


    if(promoted == Bool.True){

        ClearPiece(from);
        AddPiece(from, TakePromoted(Pce));

    }

    if((move & MFLAGFORK)!=0 || (move & MFLAGTOBEADKING)!=0){

        ClearPiece(from);
        AddPiece(from,Pce);

    }
}


function TakePromoted(PromPce) {

    var PawnOf;

    switch (PromPce) {

        case PIECES.WpiyonP : PawnOf=PIECES.WpiyonP; break;
        case PIECES.WmaceraciSah: PawnOf=PIECES.WpiyonP; break;
        case PIECES.Wkale: PawnOf=PIECES.WkaleP; break;
        case PIECES.Wvezir: PawnOf=PIECES.WvezirP; break;
        case PIECES.Wgeneral: PawnOf=PIECES.WgeneralP; break;
        case PIECES.Wat: PawnOf=PIECES.WatP; break;
        case PIECES.Wzurafa: PawnOf=PIECES.WzurafaP; break;
        case PIECES.Wdebbabe: PawnOf=PIECES.WdebbabeP; break;
        case PIECES.Wdeve: PawnOf=PIECES.WdeveP; break;
        case PIECES.Wprens: PawnOf=PIECES.WsahP; break;
        case PIECES.Wmancinik: PawnOf=PIECES.WmancinikP; break;
        case PIECES.Wfil:  PawnOf=PIECES.WfilP; break;

        case PIECES.BpiyonP:  PawnOf=PIECES.BpiyonP; break;
        case PIECES.BmaceraciSah: PawnOf=PIECES.BpiyonP;  break;
        case PIECES.Bkale: PawnOf=PIECES.BkaleP; break;
        case PIECES.Bvezir: PawnOf=PIECES.BvezirP; break;
        case PIECES.Bgeneral: PawnOf=PIECES.BgeneralP; break;
        case PIECES.Bat: PawnOf=PIECES.BatP; break;
        case PIECES.Bzurafa: PawnOf=PIECES.BzurafaP; break;
        case PIECES.Bdebbabe: PawnOf=PIECES.BdebbabeP; break;
        case PIECES.Bdeve: PawnOf=PIECES.BdeveP; break;
        case PIECES.Bprens: PawnOf=PIECES.BsahP; break;
        case PIECES.Bmancinik: PawnOf=PIECES.BmancinikP; break;
        case PIECES.Bfil: PawnOf=PIECES.BfilP; break;

    }


    return PawnOf;

}


function Promoted(piece) {

    var PromPiece;

    if(PIECES.WpiyonP && wPromNumPofP==2){
        PromPiece=PIECES.WmaceraciSah;
        return PromPiece;
    }
    else if(PIECES.BpiyonP && bPromNumPofP==2){
        PromPiece=PIECES.BmaceraciSah;
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
        case PIECES.WsahP: PromPiece=PIECES.Wprens; break;
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
        case PIECES.BsahP: PromPiece=PIECES.Bprens; break;
        case PIECES.BmancinikP: PromPiece=PIECES.Bmancinik; break;
        case PIECES.BfilP: PromPiece=PIECES.Bfil; break;

    }



    return PromPiece;
}



