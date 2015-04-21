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

	//Shuffle Decks

	Event.Shuffle.shuffle("P1 Deck", gamestate);
	Event.Shuffle.shuffle("P2 Deck", gamestate);

	//Draw 3 cards to each player from their deck

	Event.Draw.drawCards("P1 Deck", "P1 Hand", 3, gamestate);
	Event.Draw.drawCards("P2 Deck", "P2 Hand", 3, gamestate);

}

function destroyCardResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var targetCard = arguments[0];
	var enemyDiscard = API.ZoneLookup.getEnemyZoneByTag(player, "discard", gamestate);
	Event.Move.Individual.toZone(targetCard, enemyDiscard, gamestate);

	var myDiscard = API.ZoneLookup.getZoneByTag(player, "discard", gamestate);
	Event.Move.Individual.toZone(action.cardID, myDiscard, gamestate);
}

function destroyCardCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var targetCard = arguments[0];

	var enemyField = API.ZoneLookup.getEnemyZoneByTag(player, "field", gamestate);
	var targetInEField = API.CardLookup.isCardInZone(targetCard, enemyField, gamestate);

	var myHand = API.ZoneLookup.getZoneByTag(player, "hand", gamestate);
	var cardInHand = API.CardLookup.isCardInZone(action.cardID, myHand, gamestate);


	return (targetInEField && cardInHand);
}

function fireballPlayerResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var enemyPlayer = API.ValueLookup.Player.enemyPlayer(gamestate);

	Event.Modify.Player.decreaseAttributeBy(enemyPlayer, "HP", 1, gamestate);

	var myDiscard = API.ZoneLookup.getZoneByTag(player, "discard", gamestate);
	Event.Move.Individual.toZone(action.cardID, myDiscard, gamestate);
}

function fireballPlayerCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var myHand = API.ZoneLookup.getZoneByTag(player, "hand", gamestate);
	var cardInHand = API.CardLookup.isCardInZone(action.cardID, myHand, gamestate);

	return cardInHand;
}

function toFieldResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var myField = API.ZoneLookup.getZoneByTag(player, "field", gamestate);

	Event.Move.Individual.toZone(action.cardID, myField, gamestate);
}

function toFieldCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var myHand = API.ZoneLookup.getZoneByTag(player, "hand", gamestate);
	var cardInHand = API.CardLookup.isCardInZone(action.cardID, myHand, gamestate);

	return cardInHand;
}

function selfHealResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	Event.Modify.Player.increaseAttributeBy(player, "HP", 1, gamestate);

	var myDeck = API.ZoneLookup.getZoneByTag(player, "deck", gamestate);
	var myHand = API.ZoneLookup.getZoneByTag(player, "hand", gamestate);
	Event.Draw.drawCards(myDeck, myHand, cardsToDraw, gamestate);

	var myDiscard = API.ZoneLookup.getZoneByTag(player, "discard", gamestate);
	Event.Move.Individual.toZone(action.cardID, myDiscard, gamestate);
}

function selfHealCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	var myHand = API.ZoneLookup.getZoneByTag(player, "hand", gamestate);
	var cardInHand = API.CardLookup.isCardInZone(action.cardID, myHand, gamestate);

	return cardInHand;
}








function gameWinCondition()
{
	var gamestate = arguments[arguments.length - 1];

	var P1Health = API.ValueLookup.Player.getAttribute("P1", "HP", gamestate);
	var P2Health = API.ValueLookup.Player.getAttribute("P2", "HP", gamestate);

	if(P2Health <= 0)
	{
		//if Player 1 wins
		return lookupPlayer("P1", gamestate);
	}
	else if(P1Health <= 0)
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

	
	var myHealth = Math.min(10, API.ValueLookup.Player.getAttribute(player, "HP", gamestate));
	
	var enemyPlayer = API.ValueLookup.Player.enemyPlayer(gamestate);
	var enemyHealth = Math.min(10, API.ValueLookup.Player.getAttribute(enemyPlayer, "HP", gamestate));

	return (myHealth - enemyHealth + 10) / 20;
}

function main1PhaseInit()
{
	var gamestate = arguments[arguments.length - 1];

	var curPlayer = API.ValueLookup.Player.currentPlayer(gamestate);
	var myField = API.ZoneLookup.getZoneByTag(curPlayer, "field", gamestate);
	var enemyField = API.ZoneLookup.getEnemyZoneByTag(curPlayer, "field", gamestate);

	var enemyIceWalls = API.CardCounting.ofTypeInZone(enemyField, "Ice Wall", gamestate);

	var myWhirlwinds = API.CardCounting.ofTypeInZone(myField, "Whirlwind", gamestate);
	var myQuicksands = API.CardCounting.ofTypeInZone(myField, "Quicksand", gamestate);
	var mySkeletons = API.CardCounting.ofTypeInZone(myField, "Skeleton", gamestate);

	var damage = myQuicksands;

	if (enemyIceWalls === 0)
	{
		damage += (mySkeletons * 2);
	}


	var enemyPlayer = API.ValueLookup.Player.enemyPlayer(gamestate);

	Event.Modify.Player.decreaseAttributeBy(enemyPlayer, "HP", damage, gamestate);

	var cardsToDraw = myWhirlwinds + 1;

	var myDeck = API.ZoneLookup.getZoneByTag(curPlayer, "deck", gamestate);
	var myHand = API.ZoneLookup.getZoneByTag(curPlayer, "hand", gamestate);
	Event.Draw.drawCards(myDeck, myHand, cardsToDraw, gamestate);
}

function main1PhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	return true;
}

function main2PhaseInit()
{
	var gamestate = arguments[arguments.length - 1];

	var curPlayer = API.ValueLookup.Player.currentPlayer(gamestate);
	var myHand = API.ZoneLookup.getZoneByTag(curPlayer, "hand", gamestate);
	var numCardsInHand = API.CardCounting.inZone(myHand, gamestate);

	if (numCardsInHand === 0)
	{
		var myDeck = API.ZoneLookup.getZoneByTag(curPlayer, "deck", gamestate);
		Event.Draw.drawCard(myDeck, myHand, gamestate);
	}
}

function main2PhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	return true;
}