
function  BlackCapturedKings(CAPTURED) {
    var index;

    if(GameBoard.BlackNumberOfKingsInGame ==2 || GameBoard.BlackNumberOfKingsInGame ==3){

        if(CAPTURED==(PIECES.Bsah || PIECES.Bprens || PIECES.BmaceraciSah) ){
            for(index=0;index<GameBoard.BlackKingsInGame.length;index++){

                if(CAPTURED==GameBoard.BlackKingsInGame[index]){

                    GameBoard.BlackKingsInGame[index]=0;

                    if(GameBoard.BlackKingsInGame[0]==0) GameBoard.BlackHighestRanKING=PIECES.Bprens;

                    else if(GameBoard.BlackKingsInGame[0]==0 && GameBoard.BlackKingsInGame[1]==0){
                        GameBoard.BlackHighestRanKING=PIECES.BmaceraciSah;
                    }
                }
            }
            GameBoard.BlackNumberOfKingsInGame--;
        }
    }

    if(GameBoard.BlackNumberOfKingsInGame==2 || GameBoard.BlackNumberOfKingsInGame==3){

        Kings[1]=0;
    }
}


function WhiteCapturedKings(CAPTURED) {

    var index;

    if(GameBoard.WhiteNumberOfKingsInGame ==2 || GameBoard.WhiteNumberOfKingsInGame ==3){

        if(CAPTURED==PIECES.Wsah || CAPTURED==PIECES.Wprens || CAPTURED==PIECES.WmaceraciSah ){

            for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){

                if(CAPTURED==GameBoard.WhiteKingsInGame[index]){

                    GameBoard.WhiteKingsInGame[index]=0;

                    if(GameBoard.WhiteKingsInGame[0]==0) GameBoard.WhiteHighestRanKING=PIECES.Wprens;

                    else if(GameBoard.WhiteKingsInGame[0]==0 && GameBoard.WhiteKingsInGame[1]==0){

                        GameBoard.WhiteHighestRanKING=PIECES.WmaceraciSah;
                    }
                }
            }
            GameBoard.WhiteNumberOfKingsInGame--;
        }
    }

    if(GameBoard.WhiteNumberOfKingsInGame==2 || GameBoard.WhiteNumberOfKingsInGame==3){

        Kings[0]=0;
    }
}

function MoveOpponetsCitadel(to){

    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){

        if(to==181 && GameBoard.pieces[to]==GameBoard.WhiteHighestRanKING) GameBoard.WhiteCounter++;

        else if(to==88 && GameBoard.pieces[to]==GameBoard.BlackHighestRanKING) GameBoard.BlackCounter++;
    }

    else if(Colors[IndexColorOfPlayer]==COLOURS.BLACK){

        if(to==88 && GameBoard.pieces[to]==GameBoard.WhiteHighestRanKING) GameBoard.WhiteCounter++;

        else if(to==181 && GameBoard.pieces[to]==GameBoard.BlackHighestRanKING) GameBoard.BlackCounter++;
    }
}


