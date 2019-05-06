var PIECES={EMPTY:0, WpOfPawn:1, WpOfWarengine:2, WpOfCamel:3, WpOfElephant:4, WpOfMinister:5, WpOfKing:6, WpOfAdvisor:7, WpOfGiraffe:8, WpOfCatapult:9, WpOfKnight:10, WpOfRook:11,
    Wrook:12, Wknight:13, Wcatapult:14, Wgiraffe:15, Wminister:16, Wking:17, Wadvisor:18, Welephant:19, Wcamel:20, Wwarengine:21,
    BpOfPawn:22, BpOfWarengine:23, BpOfCamel:24, BpOfElephant:25, BpOfMinister:26, BpOfKing:27, BpOfAdvisor:28, BpOfGiraffe:29, BpOfCatapult:30, BpOfKnight:31, BpOfRook:32,
    Brook:33, Bknight:34, Bcatapult:35, Bgiraffe:36, Bminister:37, Bking:38, Badvisor:39, Belephant:40, Bcamel:41, Bwarengine:42,Wprince:43,
    WadKing:44,Bprince:45,BadKing:46};


var piyonlar=[PIECES.WpOfPawn,PIECES.WpOfWarengine,PIECES.WpOfCamel,PIECES.WpOfElephant,PIECES.WpOfMinister,PIECES.WpOfKing,PIECES.WpOfAdvisor,
     PIECES.WpOfGiraffe,PIECES.WpOfCatapult,PIECES.WpOfKnight,PIECES.WpOfRook
    ,PIECES.BpOfPawn,PIECES.BpOfWarengine,PIECES.BpOfCamel,PIECES.BpOfElephant,PIECES.BpOfMinister,PIECES.BpOfKing,PIECES.BpOfAdvisor,PIECES.BpOfGiraffe
    ,PIECES.BpOfCatapult,PIECES.BpOfKnight,PIECES.BpOfRook];

var WhitePawns=[PIECES.WpOfPawn,PIECES.WpOfWarengine,PIECES.WpOfCamel,PIECES.WpOfElephant,PIECES.WpOfMinister,PIECES.WpOfKing,PIECES.WpOfAdvisor,
    PIECES.WpOfGiraffe,PIECES.WpOfCatapult,PIECES.WpOfKnight,PIECES.WpOfRook];

var BlackPawns=[PIECES.BpOfPawn,PIECES.BpOfWarengine,PIECES.BpOfCamel,PIECES.BpOfElephant,PIECES.BpOfMinister,PIECES.BpOfKing,PIECES.BpOfAdvisor,
    PIECES.BpOfGiraffe,PIECES.BpOfCatapult,PIECES.BpOfKnight,PIECES.BpOfRook];

var BRD_SQ_NUM=270;

var Files={Files_0:0,Files_1:1,Files_2:2,Files_3:3,Files_4:4,Files_5:5,Files_6:6,Files_7:7,Files_8:8,Files_9:9,Files_10:10,Files_11:11,Files_12:12};
var Ranks={Rank_1:1,Rank_2:2,Rank_3:3,Rank_4:4,Rank_5:5,Rank_6:6,Rank_7:7,Rank_8:8,Rank_9:9,Rank_10:10,Rank_none:11};

var COLOURS={WHITE:0, BLACK:1, BOTH:2};
var Bool={False:0, True:1};

var SQUARES={NO_SQ:208,OFF_BOARD:209};


var PieceKeys = new Array(20* 120);
var SideKey;

var Start_FenWhite="f1d1i1i1d1f/kamzgsvzmak1/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK1/F1D1I1I1D1F w";
var Start_FenBlack="F1D1I1I1D1F/KAMZGSVZMAK1/PXCBYQEHTNR/92/92/92/92/pxcbyqehtnr/kamzgsvzmak1/f1d1i1i1d1f w";

var Colors=[COLOURS.WHITE,COLOURS.BLACK];

var ColorOfPlayer=[Start_FenWhite,Start_FenBlack];

var RandomNumber=parseInt(Math.random()*100);

var IndexColorOfPlayer=RandomNumber%2;
var WpromotionRank;
var WfromRank;
var BpromotionRank;
var BfromRank;
var WinitSqPofK;
var BinitSqPofK;
var WopponetCitadel;
var BopponetCitadel;
var WsideCitadel;
var BsideCitadel;
var WpOfpInitSq;
var BpOfpInitSq;
var WkomsuOfCitadel;
var BkomsuOfCitadel;
var decDraw=0;


var PawnsFowards;
var PawnDiagonal=new Array(2);

var MovedPiece;
var TakePiece;

if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){

    PawnsFowards=15;
    PawnDiagonal=[14,16];

    WpromotionRank=10;
    WfromRank=9;
    BpromotionRank=1;
    BfromRank=2;
    WinitSqPofK=97;
    BinitSqPofK=172;
    WopponetCitadel=181;
    BopponetCitadel=88;
    WsideCitadel=88;
    BsideCitadel=181;
    WpOfpInitSq=92;
    BpOfpInitSq=177;
    WkomsuOfCitadel=[72,87,102];
    BkomsuOfCitadel=[167,182,197];

}else{

    PawnsFowards=-15;
    PawnDiagonal=[-14,-16];

    WpromotionRank=1;
    WfromRank=2;
    BpromotionRank=10;
    BfromRank=9;
    WinitSqPofK=172;
    BinitSqPofK=97;
    WopponetCitadel=88;
    BopponetCitadel=181;
    WsideCitadel=181;
    BsideCitadel=88;
    WpOfpInitSq=177;
    BpOfpInitSq=92;
    WkomsuOfCitadel=[167,182,197];
    BkomsuOfCitadel=[72,87,102];
}


var PceChar = "-PXCBYQEHTNRKAMZGSVFDIpxcbyqehtnrkamzgsvfdiJLjl w";


var SideChar = "wb-";
var RankChar = "0123456789";
var FileChar = "abcdefghijklm";


var PieceColor = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,COLOURS.WHITE,
    COLOURS.WHITE,COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,COLOURS.WHITE, COLOURS.WHITE,COLOURS.WHITE,
    COLOURS.WHITE, COLOURS.WHITE,COLOURS.WHITE, COLOURS.WHITE,COLOURS.WHITE,
    COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK,
    COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK,
    COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK,
    /*sonradan gelen şah ve prens */COLOURS.WHITE, COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK,];

var PiecePIYON=[Bool.False,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,
    Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.True,Bool.True,Bool.True, Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,Bool.True,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False];

var PieceCamel=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceKnight=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceKing=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.True,Bool.True,Bool.True,];

var PieceMinister=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceAdvisor=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceWarengine=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceElephant=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceRook=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceGiraffe=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceCatapult=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];


var Knight_direction=[-31,-29,-17,-13,13,17,29,31];
var Catapult_direction=[-32,-28,28,32];
var Giraffe_direction=[-61,-59,-19,-11,11,19,59,61];
var Giraffe2_direction=[-15,-15,-1,1,-1,1,15,15];
var Giraffe3_direction=[-16,-14,-16,-14,14,16,14,16];
var Minister_direction=[-16,-14,14,16];
var King_direction=[-16,-15,-14,-1,1,14,15,16];
var Advisor_direction=[-15,-1,1,15];
var Camel_direction=[-46,-44,-18,-12,12,18,44,46];
var Warengine_direction=[-30,-2,2,30];

var DirectionNumber=[0/*empty*/,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,
    0/* pawn */,0/* pawn */,0/* pawn */
    ,4/*KALE*/,8/*AT*/,4/*MANCINIK*/, 8/*ZÜRAFA*/,4/*GENERAL*/,8/*ŞAH*/,4/*VEZİR*/,4/*FİL*/,8/*DEVE*/,4/*DEBBABE*/,
    0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,
    0/* pawn */,0/* pawn */,0/* pawn */
    ,4/*KALE*/,8/*AT*/,4/*MANCINIK*/, 8/*ZÜRAFA*/,4/*GENERAL*/,8/*ŞAH*/,4/*VEZİR*/,4/*FİL*/,8/*DEVE*/,4/*DEBBABE*/,
    8/*Beyaz prens*/,8/*beyaz ikinci sah*/,8/*siyah prens*/,8/*siyah ikinci sah*/];

var PieceDirection=[0,0,0,0,0,0,0,0,0,0,0,0,Advisor_direction,Knight_direction,Catapult_direction,Giraffe_direction,Minister_direction,
    King_direction,Advisor_direction,Catapult_direction,Camel_direction,Warengine_direction,
    0,0,0,0,0,0,0,0,0,0,0,Advisor_direction,Knight_direction,Catapult_direction,Giraffe_direction,Minister_direction,King_direction,
    Advisor_direction,Catapult_direction,Camel_direction,Warengine_direction,King_direction/*Beyaz prens*/,King_direction/*beyaz ikinci sah*/,
    King_direction/*siyah prens*/,King_direction/*siyah ikinci sah*/];

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var LoopNonSlidePieces=[PIECES.Wadvisor, PIECES.Wminister,PIECES.Wknight,PIECES.Welephant,PIECES.Wcamel,PIECES.Wwarengine,0,
    PIECES.Badvisor, PIECES.Bminister,PIECES.Bknight,PIECES.Belephant,PIECES.Bcamel,PIECES.Bwarengine,0];
var LoopNonSlideIndex=[0,7];

var LoopKings=[PIECES.Wking,0,PIECES.Bking,0];
var LoopKingsIndex=[0,2];

var LoopSlideRook=[PIECES.Wrook,0,PIECES.Brook,0];
var LoopSlideRookIndex=[0,2];
var LoopSlideGiraffe=[PIECES.Wgiraffe,0,PIECES.Bgiraffe,0];
var LoopSlideGiraffeIndex=[0,2];
var LoopSlideCatapult=[PIECES.Wcatapult,0,PIECES.Bcatapult,0];
var LoopSlideCatapultIndex=[0,2];


var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 1000;
var MAXDEPTH = 112;
var NOMOVE=0;
var wPromNumPofP=0;
var bPromNumPofP=0;


var sq112to342=new Array(BRD_SQ_NUM);
var sq342to112= new Array(112);

function FR2SQ(file,rank) {
    return ( (46 + (file) ) + ( (rank) * 15 ) );
}

function SQ112(sq342) {
    return sq342to112[(sq342)];
}
function SQ342(sq112) {
    return sq112to342[(sq112)];
}

function PCEINDEX(pce, pceNum) {   //buraya tekrar bakılacak
    return (pce * 15 + pceNum);
}

var Kings=[PIECES.Wking, PIECES.Bking];


/*
0000 0000 0000 0000 0000 0000 1111 1111  from

0000 0000 0000 0000 1111 1111 0000 0000 to>>8

0000 0000 0011 1111 0000 0000 0000 0000 captured>>16

0000 0000 0100 0000 0000 0000 0000 0000  promotion

0000 0000 1000 0000 0000 0000 0000 0000 MFLAGTOBEADKING

0000 0001 0000 0000 0000 0000 0000 0000 MFLAGSWITCHKING

0000 0010 0000 0000 0000 0000 0000 0000 MFLAGMOVEADKINGFROMCİTADEL

0000 0100 0000 0000 0000 0000 0000 0000 MFLAGSWITCHANYPIECE


 */



function FROMSQ(m) { return (m & 0xFF) ; }

function TOSQ(m) { return ( (m >>8 ) & 0xFF) ;}

function CAPTURED(m) { return ((m >>16 )& 0x3F) ;}

function PROM(m) { return (m >>22 ) ;}


var MFLAGTOBEADKING=0x800000;
var MFLAGSWITCHKING=0x1000000;
var MFLAGMOVEADKINGFROMCITADEL=0x2000000;
var MFLAGSWITCHANYPIECE=0x4000000;

var WsoleKingSwitchPlacePiece=0;
var BsoleKingSwitchPlacePiece=0;

function IsSquareCitadel(sq) {

    if(sq ==88 || sq ==181){

        return Bool.False;
    }
    return Bool.True;
}


function RAND_32() {

    return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
        | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

function HASH_PCE(pce,sq){

    GameBoard.PosKey^=PieceKeys[(pce*270)+sq];
}

function HASH_SIDE() {
    GameBoard.PosKey^=SideKey;
}

var GameController={};
GameController.PlayerSide=COLOURS.BOTH;
GameController.EngineSide=COLOURS.BOTH;
GameController.GameOver=Bool.False;

var UserMove={};
UserMove.from=SQUARES.NO_SQ;
UserMove.to=SQUARES.NO_SQ;


