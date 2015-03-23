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
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract the card's Cost from the player's Money
	//2. Move card to that player's Ships zone

	var cost = 5; //?? How to get attribute from card
	Event.Modify.decreaseAttributeBy(player, "Money", cost, gamestate); //?? player is player's name, need to get object?

	var playerShipZone = "P1 Ships" //?? How to get specific zone from player, ELEGANTLY
	Event.Move.Individual.toZone(action.cardID, playerShipZone, gamestate);
}

function buyCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Card must be in Ship Queue
	//2. Player must have more or equal Money than the card's Cost
	//3. The game must be in the buy phase

	//?? How to check what zone a card is in
	var inShipQueue = true;

	var cost = 5; //?? Get attribute from card
	var enoughMoney = API.ValueComparison.isAttributeGreaterThan(player, "Money", cost); //?? How to get player object from player name ('player' variable is the player's name (I think))

	//?? How to check what phase the game is in
	var buyPhase = true;
	return (inShipQueue && enoughMoney && buyPhase);
}

function rejectResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Add the card's Cost to the player's Money
	//2. Move card to Scrap Pile

	var cost = 5; //?? Get attribute from card
	Event.Modify.increaseAttributeBy(player, "Money", cost, gamestate); //?? player is playername etc etc

	Event.Move.Individual(action.cardID, "Scrap Pile", gamestate);
}

function rejectCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Card must be in Ship Queue
	//2. The game must be in the buy phase

	//?? get card's zone
	var inShipQueue = true;

	//?? get current phase
	var buyPhase = true;

	return (inShipQueue && buyPhase);
}

function attackResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Get the first card in the other player's Ships zone (the "target")
	//3. Subtract the "attacker" card's Attack from the "target" card's HP
	//4. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? player playername issue

	//?? pick a card in a zone (Here, I want the first card in a zone)
	//?? get other player's associated zone (If P1 get P2 Ships, vv)
	var targetShip = undefined;

	var damage = 3; //?? Lookup attribute of a card
	Event.Modify.decreaseAttributeBy(targetShip, "HP", damage, gamestate);

	//?? Should there be a LessThanOrEqual
	if (isAttributeLessThan(targetShip, "HP", 1))
	{
		Event.Move.Individual.toZone(targetShip, "Scrap Pile", gamestate);
		var fullHP = 6;//?? Get attribute
		Event.Modify.setAttribute(targetShip, "HP", fullHP, gamestate)
	}	


}

function attackCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var inShipZone = true; //?? how get zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? player name player object fuck

	var shipPhase = true; //?? phase checking when

	return (inShipZone && enoughEnergy && shipPhase);
}

function spreadshotResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 HP from each card in the enemy's Ships zone
	//3. If any card in the enemy's Ships zone has 0 or fewer HP, move that card to the Scrap Pile and set its HP to its FullHP

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerobj vs playername

	//?? Impossible using current technology

	//?? Impossible using current technology
}

function spreadshotCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var inShipZone = true; //?? how get zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? player name player object fuck

	var shipPhase = true; //?? phase checking when

	return (inShipZone && enoughEnergy && shipPhase);
}

function reinforceResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Money from this player
	//3. Add 3 HP to this card
	//4. If this card's HP is greater than this card's FullHP, set its HP to its FullHP

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerojb vs playername

	Event.Modify.decreaseAttributeBy(player, "Money", 1, gamestate); //?? playerojb vs playername

	Event.Modify.increaseAttributeBy(action.card, "HP", 3, gamestate); //?? card obj

	//?? get FullHP instead of using 10
	if (API.ValueComparison.isAttributeGreaterThan(action.card, "HP", 10, gamestate)) //?? card obj
	{
		//?? use FullHP here too
		Event.Modify.setAttribute(action.card, "HP", 10, gamestate);
	}
}

function reinforceCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var inShipZone = true; //?? how get zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? player name player object fuck

	var enoughMoney = API.ValueComparison.isAttributeGreaterThan(player, "Money", 0); //?? player name player object fuck

	var shipPhase = true; //?? phase checking when

	return (inShipZone && enoughEnergy && enoughMoney && shipPhase);
}

function salvageResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Gem from this player
	//3. Subtract 5 Money from this player
	//4. Draw the top card from the Scrap Pile to this player's Ships zone

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerojb vs playername

	Event.Modify.decreaseAttributeBy(player, "Gems", 1, gamestate); //?? playerojb vs playername

	Event.Modify.decreaseAttributeBy(player, "Money", 5, gamestate); //?? playerojb vs playername

	var playerShipZone = "P1 Ships" //?? but actually get the correct ship zone though
	Event.Draw.drawCard("Scrap Pile", playerShipZone, gamestate);
}

function salvageCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 1 or more Gems left
	//4. The player must have 5 or more Money left
	//5. The game must be in the ship phase

	var inShipZone = true; //?? get zone zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? name or objectt

	var enoughGems = API.ValueComparison.isAttributeGreaterThan(player, "Gems", 0); //?? name or objectt

	var enoughMoney = API.ValueComparison.isAttributeGreaterThan(player, "Money", 4); //?? name or objectt

	var shipPhase = true; // GET PHASE

	return (inShipZone && enoughEnergy && enoughGems && enoughMoney && shipPhase);
}

function railgunResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Gem from this player
	//3. Get the first card in the other player's Ships zone (the "target")
	//4. Subtract 6 from the "target" card's HP
	//5. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP


	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerojb vs playername

	Event.Modify.decreaseAttributeBy(player, "Gems", 1, gamestate); //?? playerojb vs playername

	//?? Do the rest when Attack works, but for 6 instead of attack

}

function railgunCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 1 or more Gems left
	//4. The game must be in the ship phase

	var inShipZone = true; //?? get zone zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? name or objectt

	var enoughGems = API.ValueComparison.isAttributeGreaterThan(player, "Gems", 0); //?? name or objectt

	var shipPhase = true; // current phase check

	return (inShipZone && enoughEnergy && enoughGems && shipPhase);
}

function mineResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. This player gains 1 Gem
	//3. This player gains 1 Money

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerojb vs playername
	
	Event.Modify.increaseAttributeBy(player, "Gems", 1, gamestate); //?? playerojb vs playername
	
	Event.Modify.increaseAttributeBy(player, "Money", 1, gamestate); //?? playerojb vs playername

}

function mineCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The game must be in the ship phase

	var inShipZone = true; //?? get zone zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? name or objectt

	var shipPhase = true; // GET PHASE

	return (inShipZone && enoughEnergy && shipPhase);
}

function snipeResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 3 Money from this player
	//3. Get the *LAST* card in the other player's Ships zone (the "target")
	//4. Subtract 3 from the "target" card's HP
	//5. If the "target" card's HP is less than or equal to 0, move it to the Scrap Pile and reset its HP to its FullHP

	//?? Same as Attack but get the LAST card (in this game, the most recently purchased)
}

function snipeCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 3 or more Money left
	//4. The game must be in the ship phase


	var inShipZone = true; //?? get zone zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? name or objectt

	var enoughMoney = API.ValueComparison.isAttributeGreaterThan(player, "Money", 2); //?? name or objectt

	var shipPhase = true; // GET PHASE

	return (inShipZone && enoughEnergy && enoughMoney && shipPhase);
}

function generateResult()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. Subtract 1 Energy from this player
	//2. Subtract 1 Gem from this player
	//3. This player gains 8 Money

	Event.Modify.decreaseAttributeBy(player, "Energy", 1, gamestate); //?? playerojb vs playername

	Event.Modify.decreaseAttributeBy(player, "Gems", 1, gamestate); //?? playerojb vs playername

	Event.Modify.increaseAttributeBy(player, "Money", 8, gamestate); //?? playerojb vs playername
}

function generateCheckLegality()
{
	var player = arguments[arguments.length - 3];
	var action = arguments[arguments.length - 2];
	var gamestate = arguments[arguments.length - 1];

	//1. The card must be in the player's Ships zone
	//2. The player must have 1 or more Energy left
	//3. The player must have 1 or more Gems left
	//4. The game must be in the ship phase

	
	var inShipZone = true; //?? get zone zone

	var enoughEnergy = API.ValueComparison.isAttributeGreaterThan(player, "Energy", 0); //?? name or objectt

	var enoughGems = API.ValueComparison.isAttributeGreaterThan(player, "Gems", 0); //?? name or objectt

	var shipPhase = true; // GET PHASE

	return (inShipZone && enoughEnergy && enoughGems && shipPhase);
}



function spaceshipsWinCondition()
{
	var gamestate = arguments[arguments.length - 1];

	//1. A player loses when they have no cards in their Ships zone. (The other player wins)

	if(API.CardCounting.inZone("P2 Ships", gamestate) === 0)
	{
		//Player 1 won

		//?? What do do here? New system needed
		return lookupPlayer("P1", gamestate);
	}
	else if(API.CardCounting.inZone("P1 Ships", gamestate) === 0)
	{
		//Player 2 won

		//?? What do do here? New system needed
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
	var playerName = arguments[arguments.length - 2];

	if (playerName == "P1")
	{
		return 0.5;
	}
	else
	{
		return 0.5;
	}

	return 0.5;
	//return curPlayerPile.cards.length - altPlayerPile.cards.length + (curPlayerHand.cards.length / 4) - (altPlayerHand.cards.length / 4);
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

	//1. End the Buy Phase once the player buys or rejects a ship card
	return true;
}

function shipsPhaseInit()
{
	var gamestate = arguments[arguments.length - 1];

	//1. Set the current player's Energy to 2

	//?? Get current player
	var currentPlayer = undefined;
	Event.Modify.setAttribute(currentPlayer, "Energy", 2, gamestate);
	
	return false;
}

function shipsPhaseEnd()
{
	var gamestate = arguments[arguments.length - 1];

	//1. End the Ships Phase when the player runs out of energy

	//?? Get current player
	var currentPlayer = undefined;

	var enoughEnergy = API.ValueComparison.isAttributeLessThan(currentPlayer, "Energy", 1); //?? woooo name or objectt

	return false;
}
