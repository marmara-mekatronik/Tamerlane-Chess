
$("#setFen").click(function () {

    var FenString=$("#set").val();
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

        if(piece >=PIECES.WpiyonP && piece<=PIECES.BmaceraciSah){

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

    ShowAllSqPceCanMove(UserMove.from,GameBoard.pieces[UserMove.from]);
    console.log("MoveToInitPosPawnofKing() "+MoveToInitPosPawnofKing());

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
        //console.log("MoveToInitPosPawnofKing() "+MoveToInitPosPawnofKing());

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
        WhiteCapturedKings(CAPTURED(move));
        BlackCapturedKings(CAPTURED(move));
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
        if(PromPce==PIECES.WpiyonP){

            wPromNumPofP++;

        }
        else if(PromPce==PIECES.BpiyonP){

            bPromNumPofP++;
        }
        RemoveGuiPiece(to);
        AddGuiPiece(to,PromPce);


    }


    if((move & MFLAGFORK)!=0 || (move & MFLAGTOBEADKING)!=0){

        console.log("piece "+piece+" to "+to);
        RemoveGuiPiece(from);
        AddGuiPiece(to,piece);
        console.log("to "+to);
    }
}



function DeclareDraw() {
    if( (GameBoard.WhiteCounter==1 && GameBoard.WhiteNumberOfKingsInGame==1) ||
        (GameBoard.BlackCounter==1 && GameBoard.BlackNumberOfKingsInGame==1) ){
        return Bool.True;
    }

    else if((GameBoard.WhiteCounter==1 && (GameBoard.WhiteNumberOfKingsInGame==2 || GameBoard.WhiteNumberOfKingsInGame==3)) ||
           (GameBoard.BlackCounter==1 && (GameBoard.BlackNumberOfKingsInGame==2 || GameBoard.BlackNumberOfKingsInGame==3)) ){

        document.write("oyunu berabere bitir ya da sahınızı prens veya sonradan gelen sah ile yer değiştirerek oyuna devam edin");
        var girdi=parseInt(prompt("oyunu berabere bitirmek için 0 oyuna devam etmek için 1 giriniz"));


        if(girdi==1){

            //şah, prens ya da sonradan gelen şah ile yer değiştirecek

            return Bool.False;
        }
        else if(girdi==0){

            return Bool.True;
        }
    }

    if( (GameBoard.WhiteCounter==2) || (GameBoard.BlackCounter==2)){
        return Bool.True;
    }

    return Bool.False;

}


function KingSwitchPlaceToEscape(){

    var index,piece;


    if(GameBoard.side==COLOURS.WHITE && GameBoard.pList[PCEINDEX(PIECES.Wsah,0)]==WopponetCitadel){

        for(index=0;index<GameBoard.WpceList.length;index++){

            piece=GameBoard.WpceList[index];

            if(piece==PIECES.WmaceraciSah || piece==PIECES.Wprens){

                GameBoard.WswitchToEscapeSq+=GameBoard.pList[PCEINDEX(piece,0)];

            }
        }

    }


    if(GameBoard.side==COLOURS.BLACK && GameBoard.pList[PCEINDEX(PIECES. Bsah,0)]==BopponetCitadel){

        for(index=0;index<GameBoard.BpceList.length;index++){


            piece=GameBoard.BpceList[index];

            if(piece==PIECES.BmaceraciSah || piece==PIECES.Bprens){

                GameBoard.BswitchToEscapeSq+=GameBoard.pList[PCEINDEX(piece,0)];

            }
        }
    }

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

    if(found !=0) return Bool.False;

    var InCheck=SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side],0)],GameBoard.side^1);

    if(InCheck==Bool.True){

        if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteNumberOfKingsInGame==1){

            $("#GameStatus").text("Black has won!");

            return Bool.True;

        }else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackNumberOfKingsInGame==1){

            $("#GameStatus").text("White has won!");

            return Bool.True;
        }
    }/*else {
        if( (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteNumberOfKingsInGame==1) ||
            (GameBoard.side==COLOURS.BLACK && GameBoard.BlackNumberOfKingsInGame==1)){

            $("#GameStatus").text("Stalemate!");
            return Bool.True;
        }
    }*/

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


