/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var action = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/

//Spaceships - spaceship battle game

function exampleSetup()
{
	var gamestate = arguments[arguments.length - 1];
}

function incSelfIntResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	Event.Modify.Card.increaseAttributeBy(
		action.cardID,
		"integer",
		1,
		gamestate);
}
function incSelfIntCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	return true;
}

function decCardIntResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetCard = arguments[0];
	Event.Modify.Card.decreaseAttributeBy(
		targetCard,
		"integer",
		1,
		gamestate);
}
function decCardIntCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetCard = arguments[0];
	return true;
}

function toggleZoneBoolResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetZone = lookupZone(arguments[0], gamestate);
	Event.Modify.Zone.setAttribute(
		targetZone,
		"boolean",
		!targetZone.attributes["boolean"],
		gamestate);
}
function toggleZoneBoolCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetZone = arguments[0];
	return true;
}

function newPlayerStringResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetPlayer = lookupPlayer(arguments[0], gamestate);

	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < 10; i += 1)
	{
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	Event.Modify.Player.setAttribute(
		targetPlayer,
		"string",
		text,
		gamestate);
}
function newPlayerStringCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var targetPlayer = lookupPlayer(arguments[0], gamestate);
	return true;
}

function exampleWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}

function exampleStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var player = arguments[arguments.length - 2];
	return 0.5;
}

function doActionInit()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}

function doActionEnd()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}