/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/

//Poker - Five card draw

function pokerSetup()
{
	//var gamestate;
	var gamestate = arguments[arguments.length - 1];

	var deckZone = lookupZone("deck", gamestate).cards;

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
	//Sort both hands and move quads to piles
	sortCardsInZone(lookupZone("P1 Hand", gamestate));
	moveQuadsFromZoneAtoZoneB("P1 Hand", "P1 Pile", gamestate);
	sortCardsInZone(lookupZone("P2 Hand", gamestate));
	moveQuadsFromZoneAtoZoneB("P2 Hand", "P2 Pile", gamestate);
}

function compareCards (a, b) {
	var aNum = parseInt(lookupCard(a, currentGS).attributes.value);
	var bNum = parseInt(lookupCard(b, currentGS).attributes.value);

	if (!aNum)
	{
		switch (lookupCard(a, currentGS).attributes.value) {
			case "Jack":
				aNum = 11;
				break;
			case "Queen":
				aNum = 12;
				break;
			case "King":
				aNum = 13;
				break;
			case "Ace":
				aNum = 14;
				break;
		}
	}

	if (!bNum)
	{
		switch (lookupCard(b, currentGS).attributes.value) {
			case "Jack":
				bNum = 11;
				break;
			case "Queen":
				bNum = 12;
				break;
			case "King":
				bNum = 13;
				break;
			case "Ace":
				bNum = 14;
				break;
		}
	}

	return aNum - bNum;
}

function sortCardsInZone (zone) {
	zone.cards.sort(compareCards);
}

function discardResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var p1Hand = lookupZone("P1 Hand", gamestate);
	var p2Hand = lookupZone("P2 Hand", gamestate);

	Event.moveCardToZone(action.card, "Discard", gamestate);


}

function discardCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	return true;
}

function doneResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var p1Hand = lookupZone("P1 Hand", gamestate);
	var p2Hand = lookupZone("P2 Hand", gamestate);

	//Event.moveCardToZone(action.card, "Discard", gamestate);

	lookupCard(action.card, gamestate).attributes.done = true;

	Event.endPhase(gamestate);

}

function doneCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	if (action.card)

	return true;
}

function pokerWinCondition()
{
	var gamestate = arguments[arguments.length - 1];
	if(
		(lookupCard(lookupZone("P1 Done", gamestate).cards, gamestate).attributes.done == true) && 
		(lookupCard(lookupZone("P2 Done", gamestate).cards, gamestate).attributes.done == true)
	{
		if(false)
		{
			//gameLog("Player 1 Wins");
			return lookupPlayer("P1", gamestate);
		}
		else if(false)
		{
			//gameLog("Player 2 Wins");
			return lookupPlayer("P2", gamestate);
		}
		else
		{
			//gameLog("Players 1 and 2 Tied");
			return true;
		}
	}
	else
	{
		return false;
	}
}

//Arguments end with: gs, playerName
function pokerStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var playerName = arguments[arguments.length - 2];

	var curPlayerHand;
	var altPlayerHand;

	if (playerName == "P1")
	{
		curPlayerHand = lookupZone("P1 Hand", gamestate);
		altPlayerHand = lookupZone("P2 Hand", gamestate);
	}
	else
	{
		curPlayerHand = lookupZone("P2 Hand", gamestate);
		altPlayerHand = lookupZone("P1 Hand", gamestate);
	}

	return curPlayerPile.cards.length - altPlayerPile.cards.length + (curPlayerHand.cards.length / 4) - (altPlayerHand.cards.length / 4);
}

function discardPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];
	
	return false;
}
function discardPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	return false;
}
