var jsZones = [];
var jsCards = [];
var jsMoveTemplates = [];
var jsPlayers = [];
var jsInit = [];
var jsWin;

/*BEGIN ROCK PAPER SCISSORS*/
var zone1 = new RPSzone("player1Zone",[]);
jsZones.push(zone1);
var zone2 = new RPSzone("player2Zone",[]);
jsZones.push(zone2);

var card1Move = new RPSmoves("selectCard", []);
var card1 = new RPScard("Rock", "Rock", "", [card1Move]);
jsCards.push(card1);
var card2Move = new RPSmoves("selectCard", []);
var card2 = new RPScard("Paper", "Paper", "", [card2Move]);
jsCards.push(card2);
var card3Move = new RPSmoves("selectCard", []);
var card3 = new RPScard("Scissors", "Scissors", "", [card3Move]);
jsCards.push(card3);

var template1 = new RPSmoveTemplate("selectCard", 0,
	function ()
	{
		var pName = move.card.owner.name;
		if(pName == 'player1'){var zone = lookupZone(['name'],['player1Zone']);zone.cards.push(move.card)}
		if(pName == 'player2'){var zone = lookupZone(['name'], ['player2Zone']);zone.cards.push(move.card)}
	},
	function (){return true;});
jsMoveTemplates.push(template1);

var player1 = new RPSplayer("player1", []);
jsPlayers.push(player1);
var player2 = new RPSplayer("player2", []);
jsPlayers.push(player2);

var initPlayer1 = new RPSinitPlayers("player1", ["Rock", "Paper", "Scissors"]);
jsInit.push(initPlayer1);
var initPlayer2 = new RPSinitPlayers("player2", ["Rock", "Paper", "Scissors"]);
jsInit.push(initPlayer2);
var initZonesPerLine1 = new RPSinitZonesPerLine(2);
jsInit.push(initZonesPerLine1);

jsWin = function()
{
	var p1Zone = lookupZone(['name'], ['player1Zone']);
	var p2Zone = lookupZone(['name'], ['player2Zone']);
	var p1Card = p1Zone.cards[0];
	var p2Card = p2Zone.cards[0];
	if (!p1Card || !p2Card) {return false;}
	if (p1Card.value == p2Card.value)
	{
		p1Zone.cards = [];
		p2Zone.cards = [];
		return false;
	}
	if (p1Card.value == 'Rock' && p2Card.value == 'Scissors' || p1Card.value == 'Paper' && p2Card.value == 'Rock' || p1Card.value == 'Scissors' && p2Card.value == 'Paper')
	{
		return players[0];
	}
	if (p2Card.value == 'Rock' && p1Card.value == 'Scissors' || p2Card.value == 'Paper' && p1Card.value == 'Rock' || p2Card.value == 'Scissors' && p1Card.value == 'Paper')
	{
		return players[1];
	}
}

toJSON();
/*END ROCK PAPER SCISSORS*/

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