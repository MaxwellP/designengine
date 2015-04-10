/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3].name;
var action = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/

// (mostly) Blank Game Template

function gameSetup()
{
	var gamestate = arguments[arguments.length - 1];

	//No setup needed
}

function buyResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];


	var value = API.ValueLookup.Card.getAttribute(action.cardID, "Value", gamestate);
	Event.Modify.Player.decreaseAttributeBy(player, "Money", value, gamestate);

	var playerHand = API.ZoneLookup.getZoneByTag(player, "myHand", gamestate);
	Event.Move.Individual.toZone(action.cardID, playerHand, gamestate);

	//Move this card to the player's hand when this action is done
}

function buyCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var value = API.ValueLookup.Card.getAttribute(action.cardID, "Value", gamestate);
	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", value, gamestate);

	//Legal when the player has at least 1 money

	return enoughMoney;
}

function makeMoneyResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//Gain a money. (Click on the player rectangle to see this action)
	Event.Modify.Player.increaseAttributeBy(player, "Money", 1, gamestate);
}

function makeMoneyCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//This action is always legal
	return true;
}

function gameWinCondition()
{
	var gamestate = arguments[arguments.length - 1];

	if(false)
	{
		//if Player 1 wins
		return lookupPlayer("P1", gamestate);
	}
	else if(false)
	{
		//if Player 2 wins
		return lookupPlayer("P2", gamestate);
	}
	else if (false)
	{
		//Tie
		return true;
	}
	else
	{
		//Game not over
		return false;
	}
}

function gameStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var player = arguments[arguments.length - 2];

	//For the AI, return a number between 0 and 1, with 0 being a unfavorable state close to losing and 1 being an ideal state close to winning
	return 0.5;
}

function firstPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];

	//Things to do at the start of a phase
	return false;
}

function firstPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	//This function is called after each action. If it returns true, the phase is ended.
	//If a phase ends, the game moves to the next phase of the same player's turn, unless there are no phases left, then it is the next player's turn.


	//Returning true here ends the phase after a player takes one action.
	return true;
}