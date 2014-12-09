/*
THE FOLLOWING GO IN EACH FUNCTION MOVE
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];

THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION
var gamestate = arguments[arguments.length - 1];
*/


function selectCardResult()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var zone = arguments[0];

	moveCard(move.card, zone, gamestate);
};

function selectCardCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var zone = arguments[0];
	if (zone.cards.length == 0)
	{
		return true;
	}
	else
	{
		return false;
	};
};

function TTTWinCondition()
{
	var gamestate = arguments[arguments.length - 1];

	var zn = arguments[0].zones;

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
	if (tttCheck3(zn[0], zn[1], zn[2], "X") ||
		tttCheck3(zn[3], zn[4], zn[5], "X") ||
		tttCheck3(zn[6], zn[7], zn[8], "X") ||
		tttCheck3(zn[0], zn[3], zn[6], "X") ||
		tttCheck3(zn[1], zn[4], zn[7], "X") ||
		tttCheck3(zn[2], zn[5], zn[8], "X") ||
		tttCheck3(zn[0], zn[4], zn[8], "X") ||
		tttCheck3(zn[2], zn[4], zn[6], "X"))
	{
		return arguments[0].players[0];
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
		return arguments[0].players[1];
	}
	else 
	{
		return false;
	}
};
