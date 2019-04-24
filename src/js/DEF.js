var PIECES={EMPTY:0, WpiyonP:1, WdebbabeP:2, WdeveP:3, WfilP:4, WgeneralP:5, WsahP:6, WvezirP:7, WzurafaP:8, WmancinikP:9, WatP:10, WkaleP:11,
    Wkale:12, Wat:13, Wmancinik:14, Wzurafa:15, Wgeneral:16, Wsah:17, Wvezir:18, Wfil:19, Wdeve:20, Wdebbabe:21,
    BpiyonP:22, BdebbabeP:23, BdeveP:24, BfilP:25, BgeneralP:26, BsahP:27, BvezirP:28, BzurafaP:29, BmancinikP:30, BatP:31, BkaleP:32,
    Bkale:33, Bat:34, Bmancinik:35, Bzurafa:36, Bgeneral:37, Bsah:38, Bvezir:39, Bfil:40, Bdeve:41, Bdebbabe:42,Wprens:43,
    WmaceraciSah:44,Bprens:45,BmaceraciSah:46};


var piyonlar=[PIECES.WpiyonP,PIECES.WmancinikP,PIECES.WdeveP,PIECES.WfilP,PIECES.WgeneralP,PIECES.WsahP,PIECES.WvezirP,PIECES.WzurafaP
    ,PIECES.WdebbabeP,PIECES.WatP,PIECES.WkaleP
    ,PIECES.BpiyonP,PIECES.BmancinikP,PIECES.BdeveP,PIECES.BfilP,PIECES.BgeneralP,PIECES.BsahP,PIECES.BvezirP,PIECES.BzurafaP
    ,PIECES.BdebbabeP,PIECES.BatP,PIECES.BkaleP];
var WhitePawns=[PIECES.WpiyonP,PIECES.WmancinikP,PIECES.WdeveP,PIECES.WfilP,PIECES.WgeneralP,PIECES.WsahP,PIECES.WvezirP,PIECES.WzurafaP
    ,PIECES.WdebbabeP,PIECES.WatP,PIECES.WkaleP];
var BlackPawns=[PIECES.BpiyonP,PIECES.BmancinikP,PIECES.BdeveP,PIECES.BfilP,PIECES.BgeneralP,PIECES.BsahP,PIECES.BvezirP,PIECES.BzurafaP
    ,PIECES.BdebbabeP,PIECES.BatP,PIECES.BkaleP];

var BRD_SQ_NUM=270;

var Files={Files_0:0,Files_1:1,Files_2:2,Files_3:3,Files_4:4,Files_5:5,Files_6:6,Files_7:7,Files_8:8,Files_9:9,Files_10:10,Files_11:11,Files_12:12};
var Ranks={Rank_1:1,Rank_2:2,Rank_3:3,Rank_4:4,Rank_5:5,Rank_6:6,Rank_7:7,Rank_8:8,Rank_9:9,Rank_10:10,Rank_none:11};

var COLOURS={WHITE:0, BLACK:1, BOTH:2};
var Bool={False:0, True:1};

var SQUARES={A1:62,B1:63,C1:64,D1:65,E1:66,F1:67,G1:68,H1:69,I1:70,J1:71,K1:72,
    A10:197,B10:198,C10:199,D10:200,E10:201,F10:202,G10:203,H10:204,I10:205,
    J10:206,K10:207, NO_SQ:208,OFF_BOARD:209};



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

var PawnsFowards;
var PawnDiagonal=new Array(2);

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
}


var PceChar = "-PXCBYQEHTNRKAMZGSVFDIpxcbyqehtnrkamzgsvfdiJLjl w";

var TakePiece,MovedPiece;

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

var PieceDeve=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceAT=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceSAH=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.True,Bool.True,Bool.True,];

var PieceGENERAL=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceVEZIR=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceDEBBABE=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceFIL=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceKALE=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceZURAFA=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PieceMANCINIK=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False,];

var PiecePRENS=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.True,Bool.False,Bool.True,Bool.False,];

var PieceMACERACISAH=[Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.False,Bool.False,Bool.False, Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,Bool.False,
    Bool.False,Bool.True,Bool.False,Bool.True,];


var AT_direction=[-31,-29,-17,-13,13,17,29,31];
var MANCINIK_direction=[-32,-28,28,32];
var ZURAFA_direction=[-61,-59,-19,-11,11,19,59,61];
var ZURAFA2_direction=[-15,-15,-1,1,-1,1,15,15];
var ZURAFA3_direction=[-16,-14,-16,-14,14,16,14,16];
var GENERAL_direction=[-16,-14,14,16];
var SAH_direction=[-16,-15,-14,-1,1,14,15,16];
var VEZIR_direction=[-15,-1,1,15];
var DEVE_direction=[-46,-44,-18,-12,12,18,44,46];
var DEBBABE_direction=[-30,-2,2,30];

var DirectionNumber=[0/*empty*/,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,
    0/* pawn */,0/* pawn */,0/* pawn */
    ,4/*KALE*/,8/*AT*/,4/*MANCINIK*/, 8/*ZÜRAFA*/,4/*GENERAL*/,8/*ŞAH*/,4/*VEZİR*/,4/*FİL*/,8/*DEVE*/,4/*DEBBABE*/,
    0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,0/* pawn */,
    0/* pawn */,0/* pawn */,0/* pawn */
    ,4/*KALE*/,8/*AT*/,4/*MANCINIK*/, 8/*ZÜRAFA*/,4/*GENERAL*/,8/*ŞAH*/,4/*VEZİR*/,4/*FİL*/,8/*DEVE*/,4/*DEBBABE*/,
    8/*Beyaz prens*/,8/*beyaz ikinci sah*/,8/*siyah prens*/,8/*siyah ikinci sah*/];

var PieceDirection=[0,0,0,0,0,0,0,0,0,0,0,0,VEZIR_direction,AT_direction,MANCINIK_direction,ZURAFA_direction,GENERAL_direction,
    SAH_direction,VEZIR_direction,MANCINIK_direction,DEVE_direction,DEBBABE_direction,
    0,0,0,0,0,0,0,0,0,0,0,VEZIR_direction,AT_direction,MANCINIK_direction,ZURAFA_direction,GENERAL_direction,SAH_direction,
    VEZIR_direction,MANCINIK_direction,DEVE_direction,DEBBABE_direction,SAH_direction/*Beyaz prens*/,SAH_direction/*beyaz ikinci sah*/,
    SAH_direction/*siyah prens*/,SAH_direction/*siyah ikinci sah*/];

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var LoopNonSlidePieces=[PIECES.Wvezir, PIECES.Wgeneral,PIECES.Wat,PIECES.Wfil,PIECES.Wdeve,PIECES.Wdebbabe,0,
    PIECES.Bvezir, PIECES.Bgeneral,PIECES.Bat,PIECES.Bfil,PIECES.Bdeve,PIECES.Bdebbabe,0];
var LoopNonSlideIndex=[0,7];

var LoopKings=[PIECES.Wsah,0,PIECES.Bsah,0];
var LoopKingsIndex=[0,2];

var LoopSlideKale=[PIECES.Wkale,0,PIECES.Bkale,0];
var LoopSlideKaleIndex=[0,2];
var LoopSlideZurafa=[PIECES.Wzurafa,0,PIECES.Bzurafa,0];
var LoopSlideZurafaIndex=[0,2];
var LoopSlideMancinik=[PIECES.Wmancinik,0,PIECES.Bmancinik,0];
var LoopSlideMancinikIndex=[0,2];


var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 1000;
var MAXDEPTH = 112;
var NOMOVE=0;
var wPromNumPofP=0;
var bPromNumPofP=0;
var PROMOTED=0;

var IMMOBILE=0;
var FORKİNG=0;

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

var Kings=[PIECES.Wsah, PIECES.Bsah];


/*
0000 0000 0000 0000 0000 0000 1111 1111  from

0000 0000 0000 0000 1111 1111 0000 0000 to>>8

0000 0000 0011 1111 0000 0000 0000 0000 captured>>16

0000 0000 0100 0000 0000 0000 0000 0000  promotion

0000 0000 1000 0000 0000 0000 0000 0000 MFLAGFORK

0000 0001 0000 0000 0000 0000 0000 0000 immobile

0000 0010 0000 0000 0000 0000 0000 0000 MFLAGTOBEADKING

0000 0100 0000 0000 0000 0000 0000 0000 MFLAGSWITCHKING

0000 1000 0000 0000 0000 0000 0000 0000 MFLAGMOVEADKINGFROMCİTADEL

 */



function FROMSQ(m) { return (m & 0xFF) ; }

function TOSQ(m) { return ( (m >>8 ) & 0xFF) ;}

function CAPTURED(m) { return ((m >>16 )& 0x3F) ;}

function PROM(m) { return (m >>22 ) ;}

var MFLAGFORK=0x800000;
var MFLAGIMMOBİLE=0x1000000;
var MFLAGTOBEADKING=0x2000000;
var MFLAGSWITCHKING=0x4000000;
var MFLAGMOVEADKINGFROMCITADEL=0x8000000;


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


var WdecDraw=0;
var BdecDraw=0;