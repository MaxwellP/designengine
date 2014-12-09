/*
THE FOLLOWING GO IN EACH FUNCTION MOVE
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];

THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION
var gamestate = arguments[arguments.length - 1];
*/


function increaseValueResult()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	console.log("Increasing the value");
	console.log(move.card.value);
	move.card.value += 1;
	console.log(move.card.value);
};

function increaseValueCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	console.log("You can increase the value");
	return true;
};

function decreaseValueResult()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var zone = arguments[0];
	console.log("Decreasing the value");
	console.log(move.card.value);
	move.card.value -= 1;
	console.log(move.card.value);
};

function decreaseValueCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var move = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var zone = arguments[0];
	console.log("You can decrease the value");
	return true;
};

function showoffWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
};
