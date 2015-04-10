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

//Find all quads of cards in zoneA and move them all to zoneB
function moveQuadsFromZoneAtoZoneB (zoneAName, zoneBName, gs) {
	var zoneA = lookupZone(zoneAName, gs);
	//var zoneB = lookupZone(zoneBName, gs);
	var cardsToMove = [];
	for (var i = 0; i < zoneA.cards.length; i++)
	{
		var card = lookupCard(zoneA.cards[i], gs);
		var value = card.attributes.value;
		var counter = 0;
		for (var j = 0; j < zoneA.cards.length; j++)
		{
			var card2 = lookupCard(zoneA.cards[j], gs);
			var value2 = card2.attributes.value;
			if (value == value2)
			{
				counter += 1;
			}
		}
		if (counter == 4)
		{
			for (var j = 0; j < zoneA.cards.length; j++)
			{
				var card3 = lookupCard(zoneA.cards[j], gs);
				if (card3.attributes.value == value)
				{
					var card3Id = zoneA.cards[j];
					//If the card is not already in the cardsToMove array
					if (cardsToMove.indexOf(card3Id) == -1)
					{
						cardsToMove.push(card3Id);
					}
				}
			}
		}
	}
	for (var i = 0; i < cardsToMove.length; i++)
	{
		Event.moveCardToZone(cardsToMove[i], zoneBName, gs);
	}
}

function gotAnyResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	var card = lookupCard(action.cardID, gamestate);

	var cardWasMoved = false;

	var p1Hand = lookupZone("P1 Hand", gamestate);
	var p2Hand = lookupZone("P2 Hand", gamestate);

	if(player.name == "P1")
	{
		for (var i = p2Hand.cards.length - 1; i >= 0; i--)
		{
			if(lookupCard(p2Hand.cards[i], gamestate).attributes.value == card.attributes.value)
			{
				Event.moveCardToZone(p2Hand.cards[i], "P1 Hand", gamestate);
				cardWasMoved = true;
			}
		}
		if(!cardWasMoved)
		{
			if (lookupZone("deck", gamestate).cards.length > 0)
			{
				Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P1 Hand", gamestate);
			}
		}
		sortCardsInZone(p1Hand);
		moveQuadsFromZoneAtoZoneB("P1 Hand", "P1 Pile", gamestate);
		if(!cardWasMoved)
		{
			Event.endPhase(gamestate);
		}
	}
	else
	{
		for (var i = p1Hand.cards.length - 1; i >= 0; i--)
		{
			if(lookupCard(p1Hand.cards[i], gamestate).attributes.value == card.attributes.value)
			{
				Event.moveCardToZone(p1Hand.cards[i], "P2 Hand", gamestate);
				cardWasMoved = true;
			}
		}
		if(!cardWasMoved)
		{
			if (lookupZone("deck", gamestate).cards.length > 0)
			{
				Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P2 Hand", gamestate);
			}
		}
		sortCardsInZone(p2Hand);
		moveQuadsFromZoneAtoZoneB("P2 Hand", "P2 Pile", gamestate);
		if(!cardWasMoved)
		{
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
			//gameLog("Player 1 Wins");
			return lookupPlayer("P1", gamestate);
		}
		else if(lookupZone("P2 Pile", gamestate).cards.length > lookupZone("P1 Pile", gamestate).cards.length)
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
function fishStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var playerName = arguments[arguments.length - 2];
	//TODO: fish this

	/*var curPlayerObj = lookupPlayer(playerName, gamestate);
	var altPlayerObj = getAltPlayer(playerName, gamestate);*/

	var curPlayerPile;
	var altPlayerPile;
	var curPlayerHand;
	var altPlayerHand;

	if (playerName == "P1")
	{
		curPlayerPile = lookupZone("P1 Pile", gamestate);
		altPlayerPile = lookupZone("P2 Pile", gamestate);
		curPlayerHand = lookupZone("P1 Hand", gamestate);
		altPlayerHand = lookupZone("P2 Hand", gamestate);
	}
	else
	{
		curPlayerPile = lookupZone("P2 Pile", gamestate);
		altPlayerPile = lookupZone("P1 Pile", gamestate);
		curPlayerHand = lookupZone("P2 Hand", gamestate);
		altPlayerHand = lookupZone("P1 Hand", gamestate);
	}

	return curPlayerPile.cards.length - altPlayerPile.cards.length + (curPlayerHand.cards.length / 4) - (altPlayerHand.cards.length / 4);
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
				if (lookupZone("deck", gamestate).cards.length > 0)
				{
					Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P1 Hand", gamestate);
				}
			}
		}
	}
	else
	{
		if(lookupZone("P2 Hand", gamestate).cards.length == 0)
		{
			for(var i = 0; i < 7; i += 1)
			{
				if (lookupZone("deck", gamestate).cards.length > 0)
				{
					Event.moveCardToZone(lookupZone("deck", gamestate).cards[0], "P2 Hand", gamestate);
				}
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

function dispDeckOrder () {
	var message = "";
	var deck = lookupZone("deck", currentGS);
	for (var i = 0; i < deck.cards.length; i++)
	{
		var card = lookupCard(deck.cards[i], currentGS);
		message += card.name;
		message += ", ";
	}
	console.log(message);
}
