/*
THE FOLLOWING GO IN EACH ACTION RESULT AND LEGALITY FUNCTION
var player = arguments[arguments.length - 3];
var action = arguments[arguments.length - 2];
var gamestate = arguments[arguments.length - 1];
THE FOLLOWING GOES IN THE WIN CONDITION FUNCTION AND SCORING FUNCTION
var gamestate = arguments[arguments.length - 1];
*/

//Spaceships - spaceship battle game

function spaceshipsSetup()
{
	var gamestate = arguments[arguments.length - 1];

	//1. Shuffle Ship Deck
	//2. Deal 5 cards from Ship Deck to Ship Queue

	Event.Shuffle.shuffle("Ship Deck", gamestate);
	Event.Draw.drawCards("Ship Deck", "Ship Queue", 5, gamestate);
}

function buyResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract the card's Cost from the player's Money
	//2. Move card to that player's Ships zone
	//3. End the Buy phase

	var cost = API.ValueLookup.Card.getAttribute(action.cardID, "Cost", gamestate);
	Event.Modify.Player.decreaseAttributeBy(player, "Money", cost, gamestate);

	var playerShipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	Event.Move.Individual.toZone(action.cardID, playerShipZone, gamestate);

	Event.Modify.endPhase(gamestate);
}

function buyCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Card must be in Ship Queue
	//2. Player must have more or equal Money than the card's Cost
	//3. The game must be in the buy phase

	var inShipQueue = API.CardLookup.isCardInZone(action.cardID, "Ship Queue", gamestate);

	var cost = API.ValueLookup.Card.getAttribute(action.cardID, "Cost", gamestate);
	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", cost, gamestate);

	var buyPhase = API.Phase.checkPhase("buyPhase", gamestate);
	return (inShipQueue && enoughMoney && buyPhase);
}

function rejectResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Add 5 to the player's Money
	//2. Move card to Scrap Pile
	//3. End the Buy phase

	var moneyGained = 5;
	Event.Modify.Player.increaseAttributeBy(player, "Money", moneyGained, gamestate);

	Event.Move.Individual.toZone(action.cardID, "Scrap Pile", gamestate);

	Event.Modify.endPhase(gamestate);
}

function rejectCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Card must be in Ship Queue
	//2. The game must be in the buy phase

	var inShipQueue = API.CardLookup.isCardInZone(action.cardID, "Ship Queue", gamestate);

	var buyPhase = API.Phase.checkPhase("buyPhase", gamestate);

	return (inShipQueue && buyPhase);
}

function attackResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Get the first card in the other player's Ships zone (the "target")
	//3. Determine damage - reduce the attack value by the enemy zone's Barrier
	//4. Subtract the "attacker" card's Attack from the "target" card's HP 
	//5. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP

	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	var enemyZone = API.ZoneLookup.getEnemyZoneByTag(player, "ships", gamestate);
	var targetShip = API.CardLookup.firstCardInZone(enemyZone, gamestate);

	var damage = API.ValueLookup.Card.getAttribute(action.cardID, "Attack", gamestate);
	damage -= Math.max(0, API.ValueLookup.Zone.getAttribute(enemyZone, "Barrier", gamestate));


	Event.Modify.Card.decreaseAttributeBy(targetShip, "HP", damage, gamestate);

	if (API.ValueComparison.Card.isAttributeLessThanOrEqualTo(targetShip, "HP", 0, gamestate))
	{
		Event.Move.Individual.toZone(targetShip, "Scrap Pile", gamestate);
		var fullHP = API.ValueLookup.Card.getAttribute(targetShip, "FullHP", gamestate);
		Event.Modify.Card.setAttribute(targetShip, "HP", fullHP, gamestate);
	}


}

function attackCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughEnergy && shipPhase);
}

function spreadshotResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 2 HP from each card in the enemy's Ships zone
	//3. If any card in the enemy's Ships zone has 0 or fewer HP, move that card to the Scrap Pile and set its HP to its FullHP

	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	var enemyZone = API.ZoneLookup.getEnemyZoneByTag(player, "ships", gamestate);
	for (var enemyShip of API.CardLookup.allCardsInZone(enemyZone, gamestate))
	{
		Event.Modify.Card.decreaseAttributeBy(enemyShip, "HP", 2, gamestate);

		if (API.ValueComparison.Card.isAttributeLessThanOrEqualTo(enemyShip, "HP", 0, gamestate))
		{
			Event.Move.Individual.toZone(enemyShip, "Scrap Pile", gamestate);
			var fullHP = API.ValueLookup.Card.getAttribute(enemyShip, "FullHP", gamestate);
			Event.Modify.Card.setAttribute(enemyShip, "HP", fullHP, gamestate);
		}
	}
}

function spreadshotCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughEnergy && shipPhase);
}

function reinforceResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Money from this player
	//3. Add 3 HP to this card
	//4. If this card's HP is greater than this card's FullHP, set its HP to its FullHP

	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Money", 1, gamestate);
	
	Event.Modify.Card.increaseAttributeBy(action.cardID, "HP", 3, gamestate);

	var fullHP = API.ValueLookup.Card.getAttribute(action.cardID, "FullHP", gamestate);

	if (API.ValueComparison.Card.isAttributeGreaterThan(action.cardID, "HP", fullHP, gamestate))
	{
		Event.Modify.Card.setAttribute(action.cardID, "HP", fullHP, gamestate);
	}
}

function reinforceCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughEnergy && enoughMoney && shipPhase);
}

function salvageResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Gem from this player
	//3. Subtract 5 Money from this player
	//4. Draw the top card from the Scrap Pile to this player's Ships zone

	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Gems", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Money", 5, gamestate);

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	Event.Draw.drawCard("Scrap Pile", shipZone, gamestate);
}

function salvageCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 1 or more Gems left
	//4. The player must have 5 or more Money left
	//5. The game must be in the ship phase
	//6. There must be at least one Ship in the Scrap Pile

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var enoughGems = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Gems", 1, gamestate);

	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", 5, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	var scrapAvailable = (API.CardCounting.inZone("Scrap Pile", gamestate) >= 1);

	return (inShipZone && enoughEnergy && enoughGems && enoughMoney && shipPhase && scrapAvailable);
}

function railgunResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Gem from this player
	//3. Get the first card in the other player's Ships zone (the "target")
	//4. Subtract 6 from the "target" card's HP
	//5. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP


	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Gems", 1, gamestate);

	var enemyZone = API.ZoneLookup.getEnemyZoneByTag(player, "ships", gamestate);
	var targetShip = API.CardLookup.firstCardInZone(enemyZone, gamestate);

	var damage = 6;
	Event.Modify.Card.decreaseAttributeBy(targetShip, "HP", damage, gamestate);

	if (API.ValueComparison.Card.isAttributeLessThanOrEqualTo(targetShip, "HP", 0, gamestate))
	{
		Event.Move.Individual.toZone(targetShip, "Scrap Pile", gamestate);
		var fullHP = API.ValueLookup.Card.getAttribute(targetShip, "FullHP", gamestate);
		Event.Modify.Card.setAttribute(targetShip, "HP", fullHP, gamestate)
	}

}

function railgunCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 1 or more Gems left
	//4. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var enoughGems = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Gems", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughEnergy && enoughGems && shipPhase);
}

function mineResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. This player gains 1 Gem
	//3. This player gains 1 Money

	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);
	
	Event.Modify.Player.increaseAttributeBy(player, "Gems", 1, gamestate);
	
	Event.Modify.Player.increaseAttributeBy(player, "Money", 1, gamestate);

}

function mineCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughEnergy && shipPhase);
}

function snipeResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//targetCard is an additional argument - click on the action then click on the card to effect
	var targetCard = arguments[0];

	//1. Subtract 1 Energy from this player
	//2. Subtract 3 Money from this player
	//4. Subtract 3 from the target card's HP
	//5. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP


	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Money", 3, gamestate);

	var damage = 5;
	Event.Modify.Card.decreaseAttributeBy(targetCard, "HP", damage, gamestate);

	if (API.ValueComparison.Card.isAttributeLessThanOrEqualTo(targetCard, "HP", 0, gamestate))
	{
		Event.Move.Individual.toZone(targetCard, "Scrap Pile", gamestate);
		var fullHP = API.ValueLookup.Card.getAttribute(targetCard, "FullHP", gamestate);
		Event.Modify.Card.setAttribute(targetCard, "HP", fullHP, gamestate)
	}
}

function snipeCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//targetCard is an additional argument - click on the action then click on the card to effect
	var targetCard = arguments[0];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 3 or more Money left
	//4. The game must be in the ship phase
	//5. The targeted card is in the enemy's Ships zone

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", 2, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	var enemyZone = API.ZoneLookup.getEnemyZoneByTag(player, "ships", gamestate);
	var targetIsEnemy = API.CardLookup.isCardInZone(targetCard, enemyZone, gamestate);

	return (inShipZone && enoughEnergy && enoughMoney && shipPhase && targetIsEnemy);
}

function generateResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Gem from this player
	//2. This player gains 8 Money
	//(Does not cost energy)

	Event.Modify.Player.decreaseAttributeBy(player, "Gems", 1, gamestate);

	Event.Modify.Player.increaseAttributeBy(player, "Money", 8, gamestate);
}

function generateCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Gems left
	//3. The game must be in the ship phase

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	var inShipZone = API.CardLookup.isCardInZone(action.cardID, shipZone, gamestate);

	var enoughGems = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Gems", 1, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (inShipZone && enoughGems && shipPhase);
}

function upgradeResult()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//1. Subtract 8 Money from this player
	//3. Increase the player's ship zone's Barrier by 1


	Event.Modify.Player.decreaseAttributeBy(player, "Energy", 1, gamestate);

	Event.Modify.Player.decreaseAttributeBy(player, "Money", 8, gamestate);

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);
	Event.Modify.Zone.increaseAttributeBy(shipZone, "Barrier", 1, gamestate);

}

function upgradeCheckLegality()
{
	var player = arguments[arguments.length - 3].name;
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The player must have 1 or more Energy left
	//2. The player must have 8 or more Money left
	//3. The game must be in the ship phase

	var enoughEnergy = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Energy", 1, gamestate);

	var enoughMoney = API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo(player, "Money", 8, gamestate);

	var shipPhase = API.Phase.checkPhase("shipPhase", gamestate);

	return (enoughEnergy && enoughMoney && shipPhase)
}

function spaceshipsWinCondition()
{
	var gamestate = arguments[arguments.length - 1];

	//1. A player loses when they have no cards in their Ships zone. (The other player wins)

	if(API.CardCounting.inZone("P2 Ships", gamestate) === 0)
	{
		//Player 1 won

		//?? What do do here? New system needed?
		return lookupPlayer("P1", gamestate);
	}
	else if(API.CardCounting.inZone("P1 Ships", gamestate) === 0)
	{
		//Player 2 won

		//?? What do do here? New system needed?
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

//Arguments end with: gs, playerName
function spaceshipsStateScore()
{
	var gamestate = arguments[arguments.length - 1];
	var player = arguments[arguments.length - 2];
	//HEY soo there are some issues with how we're passing things. In this ONE CASE, it is actually being correctly passed the proper thing (the name) because Mark wrote this code

	//State score should be based on how many cards are in each player's Ships zone

	var shipZone = API.ZoneLookup.getZoneByTag(player, "ships", gamestate);

	var numShips = API.CardCounting.inZone(shipZone, gamestate);

	var maxScore = 7;

	return numShips / maxScore;
}

function buyPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];
	
	//1. Deal a card from the Ship Deck to the Ship Queue

	Event.Draw.drawCard("Ship Deck", "Ship Queue", gamestate);

	return false;
}

function buyPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	// End the phase with an event call in the Buy and Reject actions, not here

	return false;
}

function shipPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];

	//1. Set the current player's Energy to 2
	var currentPlayer = API.ValueLookup.Player.currentPlayer(gamestate);
	Event.Modify.Player.setAttribute(currentPlayer, "Energy", 2, gamestate);
	
	return false;
}

function shipPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	//1. End the Ships Phase when the player runs out of energy
	var currentPlayer = API.ValueLookup.Player.currentPlayer(gamestate);

	var enoughEnergy = API.ValueComparison.Player.isAttributeLessThanOrEqualTo(currentPlayer, "Energy", 0, gamestate);

	return enoughEnergy;
}
