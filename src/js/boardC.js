
var GameBoard={};
GameBoard.pieces= new Array(BRD_SQ_NUM);
GameBoard.side=COLOURS.WHITE;
GameBoard.hisPly=0;
GameBoard.history=[];
GameBoard.ply=0;
GameBoard.material=new Array(2);
GameBoard.piecesNUMBER=new Array(100);
GameBoard.moveListStart=new Array(MAXDEPTH);//112
GameBoard.pList= new Array(44*15);
GameBoard.moveList=new Array(MAXDEPTH*MAXPOSITIONMOVES);//112*1000
GameBoard.moveScores=new Array(MAXDEPTH*MAXPOSITIONMOVES);
GameBoard.PosKey=0;
GameBoard.WhiteKingsInGame=[PIECES.WadKing];
GameBoard.BlackKingsInGame=[PIECES.BadKing];
GameBoard.WhiteNumberOfKingsInGame=1;
GameBoard.BlackNumberOfKingsInGame=1;
GameBoard.WhiteHighestRanKING=PIECES.WadKing;
GameBoard.BlackHighestRanKING=PIECES.BadKing;
GameBoard.WhiteCounter=0;
GameBoard.BlackCounter=0;
GameBoard.WhiteOnlyKingInGame=PIECES.WadKing;
GameBoard.BlackOnlyKingInGame=PIECES.BadKing;
GameBoard.WforkList=[];
GameBoard.BforkList=[];
GameBoard.WpceList=[];
GameBoard.BpceList=[];
GameBoard.Promhistory=[];
GameBoard.WswitchToEscapeSq=[];
GameBoard.BswitchToEscapeSq=[];
GameBoard.WhitePieceInGame=new Array(30);
GameBoard.BlackPieceInGame=new Array(30);


function CheckBoard(){

    var t_pceNum=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var t_material=[0,0];

    var sq112,t_piece,t_pce_num,sq270;

    for(t_piece=PIECES.WpOfPawn;t_piece<=PIECES.BadKing;t_piece++){
        for(t_pce_num=0;t_pce_num<GameBoard.piecesNUMBER[t_piece];t_pce_num++){
            sq270=GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
            if(GameBoard.pieces[sq270] != t_piece){

              console.log("error Pce lists");
              return Bool.False;

            }
        }
    }

    for(sq112=0;sq112<112;sq112++){

       sq270=SQ342(sq112);
       t_piece=GameBoard.pieces[sq270];
       t_pceNum[t_piece]++;
    }

    for(t_piece=PIECES.WpOfPawn;t_piece<=PIECES.BadKing;t_piece++){

        if(t_pceNum[t_piece] !=GameBoard.piecesNUMBER[t_piece]){

            console.log("error t_pcenum");
            return Bool.False;
        }
    }

    if(t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] ||
        t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
        console.log('Error t_material');
        return Bool.False;
    }

    if(GameBoard.side!=COLOURS.WHITE && GameBoard.side!=COLOURS.BLACK) {
        console.log('Error GameBoard.side');
        return Bool.False;
    }

    if(GeneratePosKey()!=GameBoard.PosKey) {
        console.log('Error GameBoard.posKey');
        return Bool.False;
    }
    return Bool.True;
}

GeneratePosKey();

function PrintBoard() {

    var sq,file,rank,piece;

    console.log("\nTamerlane Chess\n");

    for (rank=Ranks.Rank_10;rank>=Ranks.Rank_1;rank--){
        var line=(RankChar[rank-1]+"        ");

        for(file=Files.Files_1;file<=Files.Files_11;file++){
            sq=FR2SQ(file,rank);
            piece=GameBoard.pieces[sq];

            if(rank==Ranks.Rank_9 && file==Files.Files_1){
                line=(RankChar[rank-1]+"       "+ PceChar[GameBoard.pieces[181]]);
            }

            line+=(" " + PceChar[piece] + " ");

            if(rank==Ranks.Rank_2 && file==Files.Files_11){
                line+=(" " + PceChar[GameBoard.pieces[88]] + " ");
            }
        }
        console.log(line);
    }
    console.log(" ");

    var line="      ";

    for(file=Files.Files_0;file<=Files.Files_12;file++){
        line+=(" " + FileChar[file] + " ");
    }

    console.log(line);
    console.log("side: " + SideChar[GameBoard.side]);
    console.log("key: " + GameBoard.PosKey.toString(16))
}

function GeneratePosKey(){

    var sq=0;
    var finalKey=0;
    var piece=PIECES.EMPTY;

    for(sq;sq<BRD_SQ_NUM;sq++){
        piece=GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY && piece !=SQUARES.OFF_BOARD){
            finalKey ^=PieceKeys[(piece*120)+sq];
        }
    }

    if(GameBoard.side==COLOURS.WHITE){
        finalKey ^=SideKey;

    }
    return finalKey;
}

function PrintPieceLists(){
    var piece,pceNum;
    for(piece=PIECES.WpOfPawn;piece<=PIECES.BadKing;piece++) {
        for (pceNum = 0; pceNum < GameBoard.piecesNUMBER[piece]; pceNum++) {
            //console.log(" ccc Piece: " + PceChar[piece] + " on " + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
            //console.log("mmm  "+PCEINDEX(piece, pceNum));
           //console.log("muzaffer  "+ GameBoard.piecesNUMBER[piece] );

        }
    }
}

function UpdateListsMaterial() {
    var piece,sq,index,colour;

    for (index = 0; index < 44 * 270; index++) {
        GameBoard.pList[index] = PIECES.EMPTY;
    }
    for (index = 0; index < 2; index++) {
        GameBoard.material[index] = 0;
    }
    for (index = 0; index < 47; index++) {
        GameBoard.piecesNUMBER[index] = 0;
    }

    for(index=0;index<112;index++){

        sq=SQ342(index);

        piece=GameBoard.pieces[sq];


        if(piece != PIECES.EMPTY){

            colour=PieceColor[piece];
            GameBoard.pList[PCEINDEX(piece,GameBoard.piecesNUMBER[piece])]=sq;

            GameBoard.piecesNUMBER[piece]++;
        }
    }

    PrintPieceLists();
}

function ResetBoard() {

    var index;
    for (index=0; index < BRD_SQ_NUM; index++) {
        GameBoard.pieces[index] = SQUARES.OFF_BOARD;
    }
    for (index = 0; index < 112; index++) {
        GameBoard.pieces[SQ342(index)] = PIECES.EMPTY;
    }
    GameBoard.PosKey = 0;
    GameBoard.side = COLOURS.BOTH;
    GameBoard.hisPly = 0;
    GameBoard.ply = 0;
    GameBoard.moveListStart[GameBoard.ply] = 0;
    GameBoard.WhiteKingsInGame=[PIECES.Wking];
    GameBoard.BlackKingsInGame=[PIECES.Bking];
    GameBoard.WhiteNumberOfKingsInGame=1;
    GameBoard.BlackNumberOfKingsInGame=1;
    GameBoard.WhiteHighestRanKING=PIECES.Wking;
    GameBoard.BlackHighestRanKING=PIECES.Bking;
    GameBoard.WhiteCounter=0;
    GameBoard.BlackCounter=0;
    GameBoard.WhiteOnlyKingInGame=PIECES.Wking;
    GameBoard.BlackOnlyKingInGame=PIECES.Bking;
    GameBoard.WforkList=[];
    GameBoard.BforkList=[];
    GameBoard.WswitchToEscapeSq=[];
    GameBoard.BswitchToEscapeSq=[];

}


function ParseFen(fen){
    ResetBoard();

    var rank=Ranks.Rank_10;
    var file=Files.Files_11;
    var piece=0;
    var count=0;
    var i=0;
    var sq342=0;
    var fenCnt=0;

    while ((rank>=Ranks.Rank_1) && fenCnt < fen.length) {
        count=1;

        switch ((fen[fenCnt])) {

            case 'p' :piece=PIECES.BpOfPawn; break;
            case 'b' :piece=PIECES.BpOfElephant; break;
            case 'c' :piece=PIECES.BpOfCamel; break;
            case 'x' :piece=PIECES.BpOfWarengine; break;
            case 'r' :piece=PIECES.BpOfRook; break;
            case 'n' :piece=PIECES.BpOfKnight; break;
            case 't' :piece=PIECES.BpOfCatapult; break;
            case 'h' :piece=PIECES.BpOfGiraffe; break;
            case 'y' :piece=PIECES.BpOfMinister; break;
            case 'q' :piece=PIECES.BpOfKing; break;
            case 'e' :piece=PIECES.BpOfAdvisor; break;
            case 'f' :piece=PIECES.Belephant; break;
            case 'd' :piece=PIECES.Bcamel; break;
            case 'i' :piece=PIECES.Bwarengine; break;
            case 'k' :piece=PIECES.Brook; break;
            case 'a' :piece=PIECES.Bknight; break;
            case 'm' :piece=PIECES.Bcatapult; break;
            case 'z' :piece=PIECES.Bgiraffe; break;
            case 'g' :piece=PIECES.Bminister; break;
            case 's' :piece=PIECES.Bking; break;
            case 'v' :piece=PIECES.Badvisor; break;

            case 'P' :piece=PIECES.WpOfPawn; break;
            case 'B' :piece=PIECES.WpOfElephant; break;
            case 'C' :piece=PIECES.WpOfCamel; break;
            case 'X' :piece=PIECES.WpOfWarengine; break;
            case 'R' :piece=PIECES.WpOfRook; break;
            case 'N' :piece=PIECES.WpOfKnight; break;
            case 'T' :piece=PIECES.WpOfCatapult; break;
            case 'H' :piece=PIECES.WpOfGiraffe; break;
            case 'Y' :piece=PIECES.WpOfMinister; break;
            case 'Q' :piece=PIECES.WpOfKing; break;
            case 'E' :piece=PIECES.WpOfAdvisor; break;
            case 'F' :piece=PIECES.Welephant; break;
            case 'D' :piece=PIECES.Wcamel; break;
            case 'I' :piece=PIECES.Wwarengine; break;
            case 'K' :piece=PIECES.Wrook; break;
            case 'A' :piece=PIECES.Wknight; break;
            case 'M' :piece=PIECES.Wcatapult; break;
            case 'Z' :piece=PIECES.Wgiraffe; break;
            case 'G' :piece=PIECES.Wminister; break;
            case 'S' :piece=PIECES.Wking; break;
            case 'V' :piece=PIECES.Wadvisor; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                piece=PIECES.EMPTY;
                count=fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            case '/':
            case ' ':
                rank--;
                //file=Files.Files_1;
                if(rank>=Ranks.Rank_5){ file=Files.Files_11; }
                else{ file=Files.Files_1; }

                fenCnt++;
                continue;
            default:
                console.log("Fen ERROR");
                return;
        }

        for(i=0;i<count;i++){

            sq342=FR2SQ(file,rank);
            GameBoard.pieces[sq342]=piece;


            if(rank>=Ranks.Rank_5){ file--; }
            else{ file++; }

        }
        fenCnt++;
    }
    GameBoard.side=(fen[fenCnt]=='w') ? COLOURS.WHITE : COLOURS.BLACK;
    GameBoard.PosKey=GeneratePosKey();
    UpdateListsMaterial();
    PrintSqAttacked();

}

function PrintSqAttacked() {
    var sq,file,rank,piece;

    console.log("Attacked: \n");

    for(rank=Ranks.Rank_10;rank>=Ranks.Rank_1;rank--){
        var line=((rank-1)+"       ");

        if(rank !=9) line+="   ";

        for(file=Files.Files_1;file<=Files.Files_11;file++){

            sq=FR2SQ(file,rank);

            if( rank==9 && file==1){

                if(SqAttacked(181,GameBoard.side)==Bool.True) piece="X";
                else piece="-";
                line+=(" "+piece+" ");

            }

            if(SqAttacked(sq,GameBoard.side)==Bool.True) piece="X";
            else piece="-";

            line+=(" "+piece+" ");

            if(rank==2 && file==11 ){

                if(SqAttacked(88,GameBoard.side)==Bool.True) piece="X";
                else piece="-";

                line+=(" "+piece+" ");
            }
        }
        console.log(line);
    }
}

function  SqAttacked(sq,side){

    var pce,t_sq,index,direction;


    if(IsSquareCitadel(sq)==Bool.True ) {

        if ((side == COLOURS.WHITE && GameBoard.BlackNumberOfKingsInGame == 1) ||
            (side == COLOURS.BLACK && GameBoard.WhiteNumberOfKingsInGame == 1)) {

            if (Colors[IndexColorOfPlayer] == COLOURS.WHITE) {

                if (side == COLOURS.WHITE) {
                    for (index = 0; index < 11; index++) {

                        if (piyonlar[index] == GameBoard.pieces[sq - 14] || piyonlar[index] == GameBoard.pieces[sq - 16]) {

                            return Bool.True;
                        }
                    }
                }
                else if (side == COLOURS.BLACK) {
                    for (index = 0; index < 11; index++) {

                        if (piyonlar[index + 12] == GameBoard.pieces[sq + 14] || piyonlar[index + 12] == GameBoard.pieces[sq + 16]) {

                            return Bool.True;
                        }
                    }
                }
            }

            else if (Colors[IndexColorOfPlayer] == COLOURS.BLACK) {

                if (side == COLOURS.WHITE) {
                    for (index = 0; index < 10; index++) {

                        if (piyonlar[index] == GameBoard.pieces[sq + 14] || piyonlar[index] == GameBoard.pieces[sq + 16]) {

                            return Bool.True;
                        }
                    }
                }
                else {
                    for (index = 0; index < 10; index++) {

                        if (piyonlar[index + 12] == GameBoard.pieces[sq - 14] || piyonlar[index + 12] == GameBoard.pieces[sq - 16]) {

                            return Bool.True;
                        }
                    }
                }
            }


            for (index = 0; index < Knight_direction.length; index++) { //at
                pce = GameBoard.pieces[sq + Knight_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceKnight[pce] == Bool.True) {
                    return Bool.True;
                }
            }

            for (index = 0; index < Camel_direction.length; index++) { //deve

                pce = GameBoard.pieces[sq + Camel_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceCamel[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Catapult_direction.length; index++) { //FİL

                pce = GameBoard.pieces[sq + Catapult_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceElephant[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Advisor_direction.length; index++) { //VEZİR

                pce = GameBoard.pieces[sq + Advisor_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceAdvisor[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Minister_direction.length; index++) { //GENERAL
                pce = GameBoard.pieces[sq + Minister_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceMinister[pce] == Bool.True) {
                    return Bool.True;
                }
            }


            for (index = 0; index < Warengine_direction.length; index++) { //DEBBABE

                pce = GameBoard.pieces[sq + Warengine_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceWarengine[pce] == Bool.True) {
                    return Bool.True;
                }
            }


            for (index = 0; index < Giraffe_direction.length; index++) { //zürafa

                direction = Giraffe_direction[index];
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];

                if (GameBoard.pieces[t_sq - Knight_direction[index]] == PIECES.EMPTY && GameBoard.pieces[t_sq - Camel_direction[index]] == PIECES.EMPTY) {

                    while (pce != SQUARES.OFF_BOARD) {

                        if (GameBoard.pieces[t_sq - Giraffe3_direction[index]] == PIECES.EMPTY) {

                            if (pce != PIECES.EMPTY) {
                                if (PieceGiraffe[pce] == Bool.True && PieceColor[pce] == side) {

                                    return Bool.True;
                                }
                            }
                            t_sq += Giraffe2_direction[index];
                            pce = GameBoard.pieces[t_sq];
                        } else {

                            break;
                        }
                    }
                }
            }

            for (index = 0; index < Advisor_direction.length; index++) { //KALE
                direction = Advisor_direction[index];
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];

                while (pce != SQUARES.OFF_BOARD) {

                    if (pce != PIECES.EMPTY) {
                        if (PieceRook[pce] == Bool.True && PieceColor[pce] == side) {

                            return Bool.True;
                        }
                        break;
                    }
                    t_sq += direction;
                    pce = GameBoard.pieces[t_sq];
                }
            }

            for (index = 0; index < Catapult_direction.length; index++) { //mancınık

                direction = Catapult_direction[index];
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];

                if (GameBoard.pieces[t_sq - Minister_direction[index]] == PIECES.EMPTY) {

                    while (pce != SQUARES.OFF_BOARD) {

                        if (pce != PIECES.EMPTY) {

                            if (PieceCatapult[pce] == Bool.True && PieceColor[pce] == side) {

                                return Bool.True;
                            }
                            break;
                        }
                        t_sq += Minister_direction[index];
                        pce = GameBoard.pieces[t_sq];
                    }
                }
            }


        }

    }

    for (index = 0; index < King_direction.length; index++) { //SAHlar
        pce = GameBoard.pieces[sq + King_direction[index]];


        if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceKing[pce] == Bool.True) {

            return Bool.True;
        }
    }


    return Bool.False;
}


