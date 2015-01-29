/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/
function fishSetup()
{
	//var gamestate;
	var gamestate = arguments[arguments.length - 1];
	var pile = lookupZone("deck", gamestate).cards;

	/*Fisher-Yates Shuffle*/
	var currentIndex = pile.length;
	var tempVal;
	var randomIndex;
	while(0 != currentIndex)
	{
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		tempVal = pile[currentIndex];
		pile[currentIndex] = pile[randomIndex];
		pile[randomIndex] = tempVal;
	}

	/*now make the zone "deck"'s cards into pile*/
	/*
		is it ok by reference?
	*/

	/*Deal 7 cards to each player*/
	for(var i = 0; i < 7; i += 1)
	{
		for(var j = 0; j < gamestate.players.length; j += 1)
		{
			var deckZone = lookupZone("deck", gamestate);
			if(gamestate.players[j].name == "P1")
			{
				Event.moveCardToZone(deckZone.cards[0], "P1 Hand", gamestate);
			}
			else
			{
				Event.moveCardToZone(deckZone.cards[0], "P2 Hand", gamestate);
			}
		}
	}
}
function gotAnyResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var cardWasMoved = false;

	var p1Hand = lookupZone("P1 Hand", gamestate);
	var p2Hand = lookupZone("P2 Hand", gamestate);

	if(player.name == "P1")
	{
		for(var i = 0; i < p2Hand.cards.length; i += 1)
		{
			if(lookupCard(p2Hand.cards[i], gamestate).attributes.value == action.card.attributes.value)
			{
				Event.moveCardToZone(p2Hand.cards[i], "P1 Hand", gamestate);
				cardWasMoved = true;
			}
		}
		if(!cardWasMoved)
		{
			Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P1 Hand", gamestate);
			Event.endPhase(gamestate);
		}
	}
	else
	{
		for(var i = 0; i < p1Hand.cards.length; i += 1)
		{
			if(lookupCard(p1Hand.cards[i], gamestate).attributes.value == action.card.attributes.value)
			{
				Event.moveCardToZone(p1Hand.cards[i], "P2 Hand", gamestate);
				cardWasMoved = true;
			}
		}
		if(!cardWasMoved)
		{
			Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P2 Hand", gamestate);
			Event.endPhase(gamestate);
		}
	}
}
function gotAnyCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	return true;
}
function fishWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	if(
		(lookupZone("deck", gamestate).cards.length == 0) &&
		(lookupZone("P1 Hand", gamestate).cards.length == 0) && 
		(lookupZone("P2 Hand", gamestate).cards.length == 0))
	{
		if(lookupZone("P1 Pile", gamestate).cards.length > lookupZone("P2 Pile", gamestate).cards.length)
		{
			console.log("Player 1 Wins");
		}
		else if(lookupZone("P2 Pile", gamestate).cards.length > lookupZone("P1 Pile", gamestate).cards.length)
		{
			console.log("Player 2 Wins");
		}
		else
		{
			console.log("Players 1 and 2 Tied");
		}
		return true;
	}
	else
	{
		return false;
	}
}
function fishStateScore()
{
	var gamestate = arguments[arguments.length - 1];
}
function askPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];
	if(lookupPlayer(gamestate.turnPlayer, gamestate) == "P1")
	{
		if(lookupZone("P1 Hand", gamestate).cards.length == 0)
		{
			for(var i = 0; i < 7; i += 1)
			{
				Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P1 Hand", gamestate);
			}
		}
	}
	else
	{
		if(lookupZone("P2 Hand", gamestate).cards.length == 0)
		{
			for(var i = 0; i < 7; i += 1)
			{
				Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P2 Hand", gamestate);
			}
		}
	}
	return false;
}
function askPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];
	return false;
}