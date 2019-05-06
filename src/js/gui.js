
$("#setFen").click(function () {

    var FenString=$("#set").val();
    console.log("FenString "+FenString);
    NewGame(FenString);



});


function NewGame(FenString) {

    ParseFen(FenString);
    PrintBoard();
    SetInitialBoardPieces();
    CheckandSet();

}


function ClearAllPieces() {

    $(".Piece").remove();

}


function SetInitialBoardPieces() {

    var sq ;
    var sq270;

    var piece;

    ClearAllPieces();
    for(sq=0;sq<112;sq++){

        sq270=SQ342(sq);
        piece=GameBoard.pieces[sq270];

        if(piece >=PIECES.WpOfPawn && piece<=PIECES.BadKing){

            AddGuiPiece(sq270,piece);
        }
    }
}


function DeSelected(sq) {
    $(".Square").each(function () {

        $(this).removeClass("SqAttacked");

        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).removeClass("SqSelected");
        }
    });
}


function SetSelected(sq) {

    $(".Square").each(function () {

        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True && PieceColor[GameBoard.pieces[sq]] == GameBoard.side){

            $(this).addClass("SqSelected");
        }
    });
}


function  ClickedSquare(pageX,pageY) {

    var position =$("#board").position();
    var workedX=Math.floor(position.left);
    var workedY=Math.floor(position.top);

    pageX=Math.floor(pageX);
    pageY=Math.floor(pageY);

    var file=Math.floor((pageX-workedX)/60);
    var rank=10-Math.floor((pageY-workedY)/60);

    var sq=FR2SQ(file,rank);

    SetSelected(sq);

    return sq;
}

$(document).on("click",".Piece", function (e) {

    if(UserMove.from==SQUARES.NO_SQ){

        UserMove.from= ClickedSquare(e.pageX,e.pageY);


    }else{
        UserMove.to= ClickedSquare(e.pageX,e.pageY);
    }


    MakeUserMove();


    ShowSquaresPieceCanMove(UserMove.from,GameBoard.pieces[UserMove.from]);


});


$(document).on("click",".Square", function (e) {

    if(UserMove.from !=SQUARES.NO_SQ){

        UserMove.to= ClickedSquare(e.pageX,e.pageY);
        MakeUserMove();
    }

});


function MakeUserMove() {

    if(UserMove.from !=SQUARES.NO_SQ && UserMove.to !=SQUARES.NO_SQ ){
        var parsed=ParseMove(UserMove.from,UserMove.to);
        var piece=GameBoard.pieces[UserMove.from];
        console.log("piece "+piece);

        console.log("user move "+ PrSq(UserMove.from)+ PrSq(UserMove.to));

        if(parsed !=NOMOVE){

            MakeMove(parsed);
            PrintBoard();
            MoveGuiPiece(parsed,piece);
            CheckandSet();

        }


        DeSelected(UserMove.from);
        DeSelected(UserMove.to);
        UserMove.from=SQUARES.NO_SQ;
        UserMove.to =SQUARES.NO_SQ;

    }

}



function RemoveGuiPiece(sq) {

    $(".Piece").each(function () {

        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).remove();


        }
    });
}

function AddGuiPiece(sq,pce) {

    var file=FilesBrd[sq];
    var rank=RanksBrd[sq];

    var rankName="rank"+ rank;
    var fileName="file"+ file;
    var pieceFileName="images/" + SideChar[PieceColor[pce]] + PceChar[pce].toUpperCase() + ".png";
    var imageString="<image   src=\"" +pieceFileName +"\" class=\"Piece " +rankName + " " + fileName + "\"/>";
    $("#board").append(imageString);
}


function MoveGuiPiece(move,piece) {

    var from=FROMSQ(move);
    var to=TOSQ(move);


    if(CAPTURED(move)){
        RemoveGuiPiece(to);

    }


    var file=FilesBrd[to];
    var rank=RanksBrd[to];
    var rankName="rank"+ rank;
    var fileName="file"+ file;

    $(".Piece").each(function () {

        if(PieceIsOnSq(from,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).removeClass();
            $(this).addClass("Piece "+rankName+" "+fileName);

        }
    });

    MoveOpponetsCitadel(to);

    console.log("move: "+move);

    if( (PROM(move)) ==1 ){

        var PromPce=Promoted(piece);
        if(PromPce==PIECES.WpOfPawn){

            wPromNumPofP++;

        }
        else if(PromPce==PIECES.BpOfPawn){

            bPromNumPofP++;
        }
        RemoveGuiPiece(to);
        AddGuiPiece(to,PromPce);


    }else if( (move & MFLAGSWITCHKING)!=0 || (move & MFLAGSWITCHANYPIECE)!=0){


        var pieceInto=GameBoard.pieces[to];
        var pieceInfrom=GameBoard.pieces[from];
        RemoveGuiPiece(from);
        RemoveGuiPiece(to);
        AddGuiPiece(from,pieceInfrom);
        AddGuiPiece(to,pieceInto);


        if((move & MFLAGSWITCHANYPIECE)!=0){

            console.log("şah herhangi bir taş ile yer değişti");
            if(PieceColor[pieceInto]==COLOURS.WHITE) WsoleKingSwitchPlacePiece++;
            else if(PieceColor[pieceInto]==COLOURS.BLACK) BsoleKingSwitchPlacePiece++;
        }

    }


}



function DeclareDraw() {


    if( (GameBoard.WhiteCounter==1 && GameBoard.WhiteNumberOfKingsInGame==1) ||
        (GameBoard.BlackCounter==1 && GameBoard.BlackNumberOfKingsInGame==1) ){

        return Bool.True;
    }
    else if(GameBoard.WhiteCounter==1 && (GameBoard.WhiteNumberOfKingsInGame==2 || GameBoard.WhiteNumberOfKingsInGame==3)&& decDraw==0 ){

        decDraw=parseInt(prompt("oyunu berabere bitirmek için 1 oyuna devam etmek için 2 giriniz"));

        if(decDraw==2){

            //şah, prens ya da sonradan gelen şah ile yer değiştirecek

            return Bool.False;
        }
        else if(decDraw===1){

            return Bool.True;
        }
    }
    else if(GameBoard.BlackCounter==1 && (GameBoard.BlackNumberOfKingsInGame==2 || GameBoard.BlackNumberOfKingsInGame==3) && decDraw==0){

        decDraw=parseInt(prompt("oyunu berabere bitirmek için 1 oyuna devam etmek için 2 giriniz"));

        if(decDraw==2){

            //şah, prens ya da sonradan gelen şah ile yer değiştirecek

            return Bool.False;
        }
        else if(decDraw==1){

            return Bool.True;
        }
    }


    if( (GameBoard.WhiteCounter==2) || (GameBoard.BlackCounter==2)){
        return Bool.True;
    }

    return Bool.False;

}


function CheckResult(){

    if(DeclareDraw()==Bool.True){

        $("#GameStatus").text("Game is draw!");

        return Bool.True;
    }

    GenerationMoves();
    var MoveNum;
    var found=0;


    for(MoveNum=GameBoard.moveListStart[GameBoard.ply];MoveNum<GameBoard.moveListStart[GameBoard.ply+1];MoveNum++){


        if(MakeMove(GameBoard.moveList[MoveNum])==Bool.False){

            continue;
        }

        found++;
        TakeMove();
        break;
    }
     var soleKing;

    if(GameBoard.side==COLOURS.WHITE) soleKing=GameBoard.WhiteOnlyKingInGame;
    else soleKing=GameBoard.BlackOnlyKingInGame;

    var InCheck=SqAttacked(GameBoard.pList[PCEINDEX(soleKing,0)],GameBoard.side^1);

    console.log("InCheck: "+InCheck);

    if(found !=0) return Bool.False;

    if(InCheck==Bool.True){


        console.log("oyun bitti! "+GameBoard.WhiteNumberOfKingsInGame);

        if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteNumberOfKingsInGame==1){

            $("#GameStatus").text("Black has won!");


            return Bool.True;

        }else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackNumberOfKingsInGame==1){

            $("#GameStatus").text("White has won!");

            return Bool.True;
        }
    }else {
        if( (GameBoard.side==COLOURS.BLACK && GameBoard.WhiteNumberOfKingsInGame==1) ||
            (GameBoard.side==COLOURS.WHITE && GameBoard.BlackNumberOfKingsInGame==1)){

            $("#GameStatus").text("Stalemate!");
            return Bool.True;
        }
    }

    return Bool.False;

}

function CheckandSet() {

    if(CheckResult()==Bool.True){
        GameController.GameOver=Bool.True;

    }else{
        GameController.GameOver=Bool.False;
        $("#GameStatus").text('');
    }

}


