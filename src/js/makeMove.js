

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

    if( (move & MFLAGSWITCHKING)!=0 || (move & MFLAGSWITCHANYPIECE)!=0){

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

    for(index=0;index<LoopKings.length;index++){

        if(LoopKings[index]==piece){

            LoopKings.splice(index,1);
        }
    }

    if(PieceColor[piece]==COLOURS.WHITE){

        for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){
            if(GameBoard.WhiteKingsInGame[index]==piece){
                GameBoard.WhiteKingsInGame.splice(index,1);
                GameBoard.WhiteNumberOfKingsInGame--;
                LoopKingsIndex[1]--;

            }
        }
        if(piece==GameBoard.WhiteHighestRanKING){
            if(GameBoard.WhiteKingsInGame.length==2) GameBoard.WhiteHighestRanKING=PIECES.Wprince;
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

            }
        }
        if(piece==GameBoard.BlackHighestRanKING){
            if(GameBoard.BlackKingsInGame.length==2) GameBoard.BlackHighestRanKING=PIECES.Bprince;
            else if(GameBoard.BlackKingsInGame.length==1){

                GameBoard.BlackHighestRanKING=GameBoard.BlackKingsInGame[0];
                GameBoard.BlackOnlyKingInGame=GameBoard.BlackKingsInGame[0];
            }
        }
    }
}


function AddKing(promPiece) {

    if(promPiece==PIECES.Wprince || promPiece==PIECES.WadKing){

        GameBoard.WhiteOnlyKingInGame=PIECES.EMPTY;
        GameBoard.WhiteNumberOfKingsInGame++;
        GameBoard.WhiteKingsInGame.push(promPiece);
        LoopKingsIndex[1]++;
        LoopKings.unshift(promPiece);

    }else if(promPiece==PIECES.Bprince || promPiece==PIECES.BadKing){

        GameBoard.BlackOnlyKingInGame=PIECES.EMPTY;
        GameBoard.BlackNumberOfKingsInGame++;
        GameBoard.BlackKingsInGame.push(promPiece);
        LoopKings.splice(LoopKings.length-1,2,promPiece,0);
    }
}

function SoleKingMustGetOutOfOpponnetCitadel(side) {

    var index;
    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];



    if( GameBoard.WhiteOnlyKingInGame!=PIECES.Wking && WsqOfKing==BsideCitadel && side==COLOURS.WHITE){

        for(index=0;index<BkomsuOfCitadel.length;index++){

            console.log(BkomsuOfCitadel[index]);

            if(SqAttacked(BkomsuOfCitadel[index],COLOURS.BLACK)==Bool.False){

                console.log("beyaz şah kaleden çıkmalı");

                return Bool.False;
            }
        }

    } else if(GameBoard.BlackOnlyKingInGame!=PIECES.Bking && BsqOfKing==WsideCitadel && side==COLOURS.BLACK){

        for(index=0;index<WkomsuOfCitadel.length;index++){

            if(SqAttacked(WkomsuOfCitadel[index],COLOURS.WHITE)==Bool.False){

                console.log("siyah şah kaleden çıkmalı");

                return Bool.False;
            }
        }
    }

    return Bool.True;


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

    var soleKing;
    if(side==COLOURS.WHITE && GameBoard.WhiteOnlyKingInGame!=0) soleKing=GameBoard.WhiteOnlyKingInGame;

    else if(side==COLOURS.BLACK && GameBoard.BlackOnlyKingInGame!=0) soleKing=GameBoard.BlackOnlyKingInGame;

    else soleKing=0;
    console.log("soleKing: "+soleKing);


    if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing,0)], GameBoard.side) ){

        console.log("tehdit altında!!!");

        TakeMove();
        return Bool.False;
    }
    else if(NotCapturedPawnOfPawn(piece,to)==Bool.False || SoleKingMustGetOutOfOpponnetCitadel(side)==Bool.False){

        TakeMove();
        return Bool.False;

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

        case PIECES.WpOfPawn: PawnOf=PIECES.WpOfPawn; break;
        case PIECES.WadKing: PawnOf=PIECES.WpOfPawn; break;
        case PIECES.Wrook: PawnOf=PIECES.WpOfRook; break;
        case PIECES.Wadvisor: PawnOf=PIECES.WpOfAdvisor; break;
        case PIECES.Wminister: PawnOf=PIECES.WpOfMinister; break;
        case PIECES.Wknight: PawnOf=PIECES.WpOfKnight; break;
        case PIECES.Wgiraffe: PawnOf=PIECES.WpOfGiraffe; break;
        case PIECES.Wwarengine: PawnOf=PIECES.WpOfWarengine; break;
        case PIECES.Wcamel: PawnOf=PIECES.WpOfCamel; break;
        case PIECES.Wprince: PawnOf=PIECES.WpOfKing; break;
        case PIECES.Wcatapult: PawnOf=PIECES.WpOfCatapult; break;
        case PIECES.Welephant:  PawnOf=PIECES.WpOfElephant; break;

        case PIECES.BpOfPawn:  PawnOf=PIECES.BpOfPawn; break;
        case PIECES.BadKing: PawnOf=PIECES.BpOfPawn; break;
        case PIECES.Brook: PawnOf=PIECES.BpOfRook; break;
        case PIECES.Badvisor: PawnOf=PIECES.BpOfAdvisor; break;
        case PIECES.Bminister: PawnOf=PIECES.BpOfMinister; break;
        case PIECES.Bknight: PawnOf=PIECES.BpOfKnight; break;
        case PIECES.Bgiraffe: PawnOf=PIECES.Bgiraffe; break;
        case PIECES.Bwarengine: PawnOf=PIECES.BpOfWarengine; break;
        case PIECES.Bcamel: PawnOf=PIECES.BpOfCamel; break;
        case PIECES.Bprince:PawnOf=PIECES.BpOfKing;break;
        case PIECES.Bcatapult: PawnOf=PIECES.BpOfCatapult; break;
        case PIECES.Belephant: PawnOf=PIECES.BpOfElephant; break;

    }

    return PawnOf;
}


function Promoted(piece) {

    var PromPiece;

    if(piece==PIECES.WpOfPawn && wPromNumPofP==2){
        PromPiece=PIECES.WadKing;
        GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]=PIECES.EMPTY;
        return PromPiece;
    }
    else if(piece==PIECES.BpOfPawn && bPromNumPofP==2){
        PromPiece=PIECES.BadKing;
        GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]=PIECES.EMPTY;
        return PromPiece;
    }


    switch (piece) {

        case PIECES.WpOfPawn: PromPiece=PIECES.WpOfPawn; break;
        case PIECES.WpOfRook: PromPiece=PIECES.Wrook; break;
        case PIECES.WpOfAdvisor: PromPiece=PIECES.Wadvisor; break;
        case PIECES.WpOfMinister: PromPiece=PIECES.Wminister; break;
        case PIECES.WpOfKnight: PromPiece=PIECES.Wknight; break;
        case PIECES.Wgiraffe: PromPiece=PIECES.WpOfGiraffe; break;
        case PIECES.WpOfWarengine: PromPiece=PIECES.Wwarengine; break;
        case PIECES.WpOfCamel: PromPiece=PIECES.Wcamel; break;
        case PIECES.WpOfKing:PromPiece=PIECES.Wprince; break;
        case PIECES.WpOfCatapult: PromPiece=PIECES.Wcatapult; break;
        case PIECES.WpOfElephant:  PromPiece=PIECES.Welephant; break;

        case PIECES.BpOfPawn: PromPiece=PIECES.BpOfPawn; break;
        case PIECES.BpOfRook: PromPiece=PIECES.Brook; break;
        case PIECES.BpOfAdvisor: PromPiece=PIECES.Badvisor; break;
        case PIECES.BpOfMinister: PromPiece=PIECES.Bminister; break;
        case PIECES.BpOfKnight: PromPiece=PIECES.Bknight; break;
        case PIECES.BpOfGiraffe: PromPiece=PIECES.Bgiraffe; break;
        case PIECES.BpOfWarengine: PromPiece=PIECES.Bwarengine; break;
        case PIECES.BpOfCamel: PromPiece=PIECES.Bcamel; break;
        case PIECES.BpOfKing:PromPiece=PIECES.Bprince; break;
        case PIECES.BpOfCatapult: PromPiece=PIECES.Bcatapult; break;
        case PIECES.BpOfElephant: PromPiece=PIECES.Belephant; break;

    }

    return PromPiece;
}



