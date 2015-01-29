/*
THE FOLLOWING GO IN EACH FUNCTION MOVE
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];

THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION
var gamestate = arguments[arguments.length - 1];
*/


function putInZoneResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var zone = arguments[0];

	//Move card to new zone
	Event.moveCardToZone(action.card.id, zone, gamestate);
	Event.endPhase(gamestate);
};

function putInZoneCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var zone = lookupZone(arguments[0], gamestate);

	//Goes in engine? hard coded restriction vs extra options for game design
	if (player.name != gamestate.turnPlayer)
	{
		return false;
	}
	//Check if zone is empty
	if (zone.cards.length == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function newTTTWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	var zn = gamestate.zones;

	var tttCheck3 = function (a, b, c, val)
	{
		var stateACard = a.cards[0];
		var stateBCard = b.cards[0];
		var stateCCard = c.cards[0];

		if (!stateACard || !stateBCard || !stateCCard)
		{
			return false;
		};

		var stateA = a.cards[0].attributes;
		var stateB = b.cards[0].attributes;
		var stateC = c.cards[0].attributes;

		if (stateA.value == val && stateB.value == val && stateC.value == val)
		{
			return true;
		};
		return false;
	};
	if (tttCheck3(zn[0], zn[1], zn[2], "X") ||
		tttCheck3(zn[3], zn[4], zn[5], "X") ||
		tttCheck3(zn[6], zn[7], zn[8], "X") ||
		tttCheck3(zn[0], zn[3], zn[6], "X") ||
		tttCheck3(zn[1], zn[4], zn[7], "X") ||
		tttCheck3(zn[2], zn[5], zn[8], "X") ||
		tttCheck3(zn[0], zn[4], zn[8], "X") ||
		tttCheck3(zn[2], zn[4], zn[6], "X"))
	{
		return "X";
	}
	else if (tttCheck3(zn[0], zn[1], zn[2], "O") ||
		tttCheck3(zn[3], zn[4], zn[5], "O") ||
		tttCheck3(zn[6], zn[7], zn[8], "O") ||
		tttCheck3(zn[0], zn[3], zn[6], "O") ||
		tttCheck3(zn[1], zn[4], zn[7], "O") ||
		tttCheck3(zn[2], zn[5], zn[8], "O") ||
		tttCheck3(zn[0], zn[4], zn[8], "O") ||
		tttCheck3(zn[2], zn[4], zn[6], "O"))
	{
		return "O";
	}
	else 
	{
		return false;
	}
};

function newTTTStateScore () {
	var gamestate = arguments[arguments.length - 1];
	var zn = gamestate.zones;

	//Check to see if val is 2 or more in a trio, but none of enVal are in that trio
	//Returns a number that will be added to a player's score for a game state
	var tttCheck = function (a, b, c, val, enVal)
	{

		var aVal = ((a.cards[0] && a.cards[0].attributes.value) || "empty")
		var bVal = ((b.cards[0] && b.cards[0].attributes.value) || "empty")
		var cVal = ((c.cards[0] && c.cards[0].attributes.value) || "empty")

		if (aVal == enVal || bVal == enVal || cVal == enVal)
		{
			return -0.3; //Cannot win here
		}

		var num = 0;
		if (aVal == val)
		{
			num++;
		}
		if (bVal == val)
		{
			num++;
		}
		if (cVal == val)
		{
			num++;
		}
		if (num >= 2)
		{
			num += 0.5;
		}
		else if (num >= 3)
		{
			num += 20;
		}
		return num; //Score based on closeness to winning
	};

	var xScore = 0;

	xScore += tttCheck(zn[0], zn[1], zn[2], "X", "O");
	xScore += tttCheck(zn[3], zn[4], zn[5], "X", "O");
	xScore += tttCheck(zn[6], zn[7], zn[8], "X", "O");
	xScore += tttCheck(zn[0], zn[3], zn[6], "X", "O");
	xScore += tttCheck(zn[1], zn[4], zn[7], "X", "O");
	xScore += tttCheck(zn[2], zn[5], zn[8], "X", "O");
	xScore += tttCheck(zn[0], zn[4], zn[8], "X", "O");
	xScore += tttCheck(zn[2], zn[4], zn[6], "X", "O");
	//console.log("xScore: " + xScore);

	var oScore = 0;

	oScore += tttCheck(zn[0], zn[1], zn[2], "O");
	oScore += tttCheck(zn[3], zn[4], zn[5], "O");
	oScore += tttCheck(zn[6], zn[7], zn[8], "O");
	oScore += tttCheck(zn[0], zn[3], zn[6], "O");
	oScore += tttCheck(zn[1], zn[4], zn[7], "O");
	oScore += tttCheck(zn[2], zn[5], zn[8], "O");
	oScore += tttCheck(zn[0], zn[4], zn[8], "O");
	oScore += tttCheck(zn[2], zn[4], zn[6], "O");
	//console.log("oScore: " + oScore);

	return [xScore - oScore, oScore - xScore];
}

function newTTTPhaseEnd () {
	var gamestate = arguments[arguments.length - 1];
	return false;
}

function newTTTInitPhase () {
	var gamestate = arguments[arguments.length - 1];
	return false;
}