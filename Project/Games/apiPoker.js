/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var move = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/

//Poker - Five card draw

function apiPokerSetup()
{
	var gamestate = arguments[arguments.length - 1];
	var deckZone = lookupZone("Deck", gamestate);
	var deckCards = deckZone.cards;

	Event.Shuffle.shuffle("Deck", gamestate);
	Event.Deal.dealCards("Deck", ["P1 Hand", "P2 Hand"], 5, gamestate);
}

/*THIS MATTERS - LOOK HERE*/
function discardResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	Event.Move.Individual.toZone(action.cardID, player.zones["Discard"],gamestate);
}

/*THIS MATTERS - LOOK HERE*/
function discardCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];
	
	var doneZone = lookupZone(player.zones["Done"], gamestate);

	if (lookupCard(doneZone.cards[0], gamestate).attributes["done"] === true)
	{
		return false;
	}

	return true;
}

/*THIS MATTERS - LOOK HERE*/
function doneResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	lookupCard(action.cardID, gamestate).attributes["done"] = true;

	var deckZone = lookupZone("Deck", gamestate);

	for(var i = 0; i < gamestate.players.length; i +=1)
	{
		var dealPlayer = gamestate.players[i];
		while(lookupZone(dealPlayer.zones["Hand"], gamestate).cards.length < 5)
		{
			Event.Move.Individual.toZone(deckZone.cards[0], dealPlayer.zones["Hand"], gamestate);
		}
	}
	Event.Modify.endPhase(gamestate);
}
/*THIS MATTERS - LOOK HERE*/
function doneCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	if (lookupCard(action.cardID, gamestate).attributes["done"] == false)
	{
		return true;
	}
	return false;
}

function discardPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];
	console.log("DISCARD PHASE INIT");
	return false;
}
function discardPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];
	console.log("DISCARD PHASE END");
	return false;
}


/*FOR SCORING - IGNORE*/
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

/*FOR SCORING - IGNORE*/
function compareAttrs (a, b) {
	var aNum = parseInt(a.value);
	var bNum = parseInt(b.value);

	if (!aNum)
	{
		switch (a.value) {
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
		switch (b.value) {
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
/*UNIMPORTANT*/
function sortCardsInZone (zone)
{
	zone.cards.sort(compareCards);
}
//Score one player's hand
//(Score from 0 to 0.5)
function scoreHand(zone, gs) {
	var cardAttr = [];
	for (var i = 0; i < zone.cards.length; i++)
	{
		var card = lookupCard(zone.cards[i], gs);
		cardAttr.push(card.attributes);
	}
	cardAttr.sort(compareAttrs);

	while (cardAttr.length < 5)
	{
		cardAttr.push(
			{value: -10 + cardAttr.length * 2,
			suit: "nocard" + cardAttr.length});
	}

	var valueOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

	var isFlush = true;
	var firstSuit = cardAttr[0].suit;
	for (var i = 0; i < cardAttr.length; i++)
	{
		if (cardAttr[i].suit != firstSuit)
		{
			isFlush = false;
		}
	}

	var isStraight = true;
	var firstValue = cardAttr[0].value;
	for (var i = 0; i < cardAttr.length; i++)
	{
		var firstIndex = valueOrder.indexOf(firstValue);
		var curIndex = valueOrder.indexOf(cardAttr[i].value);
		if (Math.abs(firstIndex - curIndex) != i)
		{
			isStraight = false;
		}
	}

	var scoreNum = 0;

	var val0 = cardAttr[0].value;
	var val1 = cardAttr[1].value;
	var val2 = cardAttr[2].value;
	var val3 = cardAttr[3].value;
	var val4 = cardAttr[4].value;

	if (isStraight && isFlush)
	{
		//Straight flush
		scoreNum = 8;
	}
	else if (val0 == val3 || val1 == val4)
	{
		//Four of a kind
		scoreNum = 7;
	}
	else if ((val0 == val1 && val2 == val4) ||
			 (val0 == val2 && val3 == val4))
	{
		//Full house
		scoreNum = 6;
	}
	else if (isFlush)
	{
		//Flush
		scoreNum = 5;
	}
	else if (isStraight)
	{
		//Straight
		scoreNum = 4;
	}
	else if (val0 == val2 || val1 == val3 || val2 == val4)
	{
		//Three of a kind
		scoreNum = 3;
	}
	else if ((val0 == val1 && val2 == val3) || (val0 == val1 && val3 == val4) || (val1 == val2 && val3 == val4))
	{
		//Two pair
		scoreNum = 2;
	}
	else if ((val0 == val1) || (val1 == val2) || (val2 == val3) || (val3 == val4))
	{
		//One pair
		scoreNum = 1;
	}
	else
	{
		//High card
		scoreNum = 0;
	}
	return scoreNum / 16;
}

function apiPokerWinCondition(gamestate)
{
	var gamestate = arguments[arguments.length - 1];
	var p1DZ = lookupZone("P1 Done", gamestate);
	var p2DZ = lookupZone("P2 Done", gamestate);
	var p1DC = lookupCard(p1DZ.cards[0], gamestate);
	var p2DC = lookupCard(p2DZ.cards[0], gamestate);

	if(p1DC.attributes["done"] && p2DC.attributes["done"])
	{
		var p1Score = scoreHand(lookupZone("P1 Hand", gamestate), gamestate);
		var p2Score = scoreHand(lookupZone("P2 Hand", gamestate), gamestate);
		if(p1Score > p2Score)
		{
			return lookupPlayer("P1", gamestate);
		}
		else if(p2Score > p1Score)
		{
			return lookupPlayer("P2", gamestate);
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

//Arguments end with: gs, playerName
function apiPokerStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var playerName = arguments[arguments.length - 2];

	var p1Score = scoreHand(lookupZone("P1 Hand", gamestate), gamestate);
	var p2Score = scoreHand(lookupZone("P2 Hand", gamestate), gamestate);

	if (playerName == "P1")
	{
		//return p1Score - p2Score + 0.5;
	}
	else
	{
		p2Score - p1Score + 0.5;
	}
	return 0.5;
	//return curPlayerPile.cards.length - altPlayerPile.cards.length + (curPlayerHand.cards.length / 4) - (altPlayerHand.cards.length / 4);
}