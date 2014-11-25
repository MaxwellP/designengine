var jsZones = [];
var jsCards = [];
var jsMoveTemplates = [];
var jsPlayers = [];
var jsInit = [];
var jsWin;

/*BEGIN TIC TAC TOE*/

var zone1 = new TTTzone(1,1,[]);
jsZones.push(zone1);
var zone2 = new TTTzone(2,1,[]);
jsZones.push(zone2);
var zone3 = new TTTzone(3,1,[]);
jsZones.push(zone3);
var zone4 = new TTTzone(1,2,[]);
jsZones.push(zone4);
var zone5 = new TTTzone(2,2,[]);
jsZones.push(zone5);
var zone6 = new TTTzone(3,2,[]);
jsZones.push(zone6);
var zone7 = new TTTzone(1,3,[]);
jsZones.push(zone7);
var zone8 = new TTTzone(2,3,[]);
jsZones.push(zone8);
var zone9 = new TTTzone(3,3,[]);
jsZones.push(zone9);

var cardMoves = [];
var cardMove1 = new TTTmoves("selectCard", [1,1]);
cardMoves.push(cardMove1);
var cardMove2 = new TTTmoves("selectCard", [2,1]);
cardMoves.push(cardMove2);
var cardMove3 = new TTTmoves("selectCard", [3,1]);
cardMoves.push(cardMove3);
var cardMove4 = new TTTmoves("selectCard", [1,2]);
cardMoves.push(cardMove4);
var cardMove5 = new TTTmoves("selectCard", [2,2]);
cardMoves.push(cardMove5);
var cardMove6 = new TTTmoves("selectCard", [3,2]);
cardMoves.push(cardMove6);
var cardMove7 = new TTTmoves("selectCard", [1,3]);
cardMoves.push(cardMove7);
var cardMove8 = new TTTmoves("selectCard", [2,3]);
cardMoves.push(cardMove8);
var cardMove9 = new TTTmoves("selectCard", [3,3]);
cardMoves.push(cardMove9);

var card1 = new TTTcard("X", "X", cardMoves);
jsCards.push(card1);
var card2 = new TTTcard("O", "O", cardMoves);
jsCards.push(card2);

var template1 = new TTTmoveTemplate("selectCard", 2, 
	function()
	{
		var zone = lookupZoneXY(arguments[0], arguments[1]);
		zone.cards.push(arguments[2].cards[0]);
	},
	function()
	{
		var zone = lookupZoneXY(arguments[0], arguments[1]);
		if (zone.cards.length == 0) {return true;}else {return false};
	});
jsMoveTemplates.push(template1);

var player1 = new TTTplayer("X", []);
jsPlayers.push(player1);
var player2 = new TTTplayer("O", []);
jsPlayers.push(player2);

var initPlayer1 = new TTTinitPlayers("X", ["X", "X", "X", "X", "X"]);
jsInit.push(initPlayer1);
var initPlayer2 = new TTTinitPlayers("O", ["O", "O", "O", "O", "O"]);
jsInit.push(initPlayer2);
var initZonesPerLine1 = new TTTinitZonesPerLine(3);
jsInit.push(initZonesPerLine1);

jsWin = function()
{
	var tttCheck3 = function (a, b, c, val)
	{
		var stateA = a.cards[0];
		var stateB = b.cards[0];
		var stateC = c.cards[0];
		if (!stateA || !stateB || !stateC)
		{
			return false;
		};
		if (stateA.value == val && stateB.value == val && stateC.value == val)
		{
			return true;
		};
		return false;
	};
	if (tttCheck3(zones[0], zones[1], zones[2], "X")
		|| tttCheck3(zones[3], zones[4], zones[5], "X")
		|| tttCheck3(zones[6], zones[7], zones[8], "X")
		|| tttCheck3(zones[0], zones[3], zones[6], "X")
		|| tttCheck3(zones[1], zones[4], zones[7], "X")
		|| tttCheck3(zones[2], zones[5], zones[8], "X")
		|| tttCheck3(zones[0], zones[4], zones[8], "X")
		|| tttCheck3(zones[2], zones[4], zones[6], "X"))
	{
		return players[0];
	}
	else if (tttCheck3(zones[0], zones[1], zones[2], "O")
		|| tttCheck3(zones[3], zones[4], zones[5], "O")
		|| tttCheck3(zones[6], zones[7], zones[8], "O")
		|| tttCheck3(zones[0], zones[3], zones[6], "O")
		|| tttCheck3(zones[1], zones[4], zones[7], "O")
		|| tttCheck3(zones[2], zones[5], zones[8], "O")
		|| tttCheck3(zones[0], zones[4], zones[8], "O")
		|| tttCheck3(zones[2], zones[4], zones[6], "O"))
	{
		return players[1];
	}
	else
	{
		return false;
	}
}

toJSON();
/*END TICTACTOE*/

function toJSON()
{
	var jsonObject = [];
	jsonObject.push({"zones": JSON.stringify(jsZones)});
	jsonObject.push({"cards": JSON.stringify(jsCards)});
	jsMoveTemplates.forEach(function(item)
	{
		item.result = singleLineStringifyFunction(item.result);
		item.checkLegality = singleLineStringifyFunction(item.checkLegality);
	})
	jsonObject.push({"moveTemplates": jsMoveTemplates});
	jsonObject.push({"players": jsPlayers});
	jsonObject.push({"init": jsInit});
	jsWin = singleLineStringifyFunction(jsWin);
	jsonObject.push({"winCondition": jsWin});
	return JSON.stringify(jsonObject);
};