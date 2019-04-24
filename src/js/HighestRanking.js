

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


