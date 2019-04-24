$(function () {

    console.log("main init fonksiyonu çağrıldı");
    Init();

    NewGame(ColorOfPlayer[IndexColorOfPlayer]);
    console.log("RandomNumber   "+RandomNumber);
    console.log("IndexColorOfPlayer "+IndexColorOfPlayer);
});



function InitFilesRanksBrd() {

    var index;
    var file=Files.A1;
    var rank=Ranks.Rank_1;
    var sq=SQUARES.A1;


    for(index=0;index<BRD_SQ_NUM;index++){
        FilesBrd[index]=SQUARES.OFF_BOARD;
        RanksBrd[index]=SQUARES.OFF_BOARD;

    }

    for(rank=Ranks.Rank_1;rank<=Ranks.Rank_10;rank++){
        for(file=Files.Files_1;file<=Files.Files_11;file++){
            sq=FR2SQ(file,rank);
            FilesBrd[sq]=file;
            RanksBrd[sq]=rank;
        }

    }
    FilesBrd[181]=0;
    RanksBrd[181]=9;      // yan taraftaki
    FilesBrd[88]=12;       // kareler için
    RanksBrd[88]=2;

}


function  InitHashKeys() {

    var index;

    for(index=0;index<20*270;index++){

        PieceKeys[index]=RAND_32();
    }
    SideKey=RAND_32();
}

function  InitSq342to112() {

    var index = 0;
    var rank = Ranks.Rank_1;
    var file = Files.Files_11;
    var sq = SQUARES.A1;
    var sq112 = 0;

    for (index; index < BRD_SQ_NUM; index++) {
        sq342to112[index] = 113;
    }

    for (index = 0; index < 112; index++) {
        sq112to342[index] = 270;

    }

    for (rank = Ranks.Rank_1; rank <= Ranks.Rank_10; rank++) {

        for (file = Files.Files_1; file <= Files.Files_11; file++) {

            sq = FR2SQ(file, rank);
            sq342to112[sq] = sq112;
            sq112to342[sq112] = sq;

            sq112++;
        }
    }

    sq112to342[110]=88;
    sq342to112[88]=110;
    sq112to342[111]=181;
    sq342to112[181]=111;

}


function SQ342(sq112) {
    return sq112to342[(sq112)];
}

function InitBoardVars(){

    var index;
    for(index=0;index<MAXGAMEMOVES;index++){

        GameBoard.history.push({
            move:NOMOVE,
            PosKey:0,
        });
    }

}



function tahta() {
    var light = 0,rank_num,rank_name,file_num,file_name,colorOfSq,createDiv,createDiv1,createDiv2;
    for (rank_num = Ranks.Rank_1; rank_num <= Ranks.Rank_10; rank_num++) {
        light ^= 1;
        rank_name = "rank" + (rank_num);
        for (file_num = Files.Files_1; file_num <= Files.Files_11; file_num++) {
            file_name = "file" + (file_num);
            (light == 0) ? colorOfSq = "light" : colorOfSq = "dark";

            createDiv = "<div class=\"Square " + rank_name + " " + file_name + " " + colorOfSq + "\" >";
            (file_num !=Files.Files_11) ? light ^= 1 : 0;
            $("#board").append(createDiv);
        }
    }
    createDiv1 = "<div class=\"Square " + "rank2 " + "file12 " + "dark " + "\" />";
    createDiv2 = "<div class=\"Square " + "rank9 " + "file0 " + "light" + "\" />";
    $("#board").append(createDiv1);
    $("#board").append(createDiv2);
}

function Init() {
    console.log("init() fonksiyonu çağrıldı");
    InitFilesRanksBrd();
    InitHashKeys();
    InitSq342to112();
    InitBoardVars();
    tahta();

}




