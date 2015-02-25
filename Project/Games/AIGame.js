/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/
function AIGameSetup()
{
	//var gamestate;
	var gamestate = arguments[arguments.length - 1];

}

//Play card action
function playCardResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	Event.moveCardToZone(action.card.id, "P2 Pile", gamestate);
	
	Event.endPhase(gamestate);
}
function playCardCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	return true;
}

//Pass action
function passResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	Event.endPhase(gamestate);
}
function passCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	return true;
}

function AIGameWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	
	var pile = lookupZone("P2 Pile", gamestate);
	if(pile.cards.length == 3)
	{
		for (var i = 0; i < pile.cards.length; i++)
		{
			var card = lookupCard(pile.cards[i], gamestate);
			if (card.name != "B")
			{
				return lookupPlayer("P1", gamestate);
			}
		}
		//All "B" cards - P2 wins
		return lookupPlayer("P2", gamestate);
	}
	else
	{
		return false;
	}
}

//Arguments end with: gs, playerName
function AIGameStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var playerName = arguments[arguments.length - 2];
	
	var pile = lookupZone("P2 Pile", gamestate);

	var score = 0;
	for (var i = 0; i < pile.cards.length; i++)
	{
		var card = lookupCard(pile.cards[i], gamestate);
		if (card.name == "A")
		{
			score += 10;
		}
	}
	if (playerName == "P2")
	{
		return score;
	}
	else
	{
		return -score;
	}
}
function playPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}
function playPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}
