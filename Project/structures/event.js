/**
* A namespace for fundamental gamestate manipulations
*
* @class Event
*/
var Event = {
	/**
	* @method moveCardToZone
	* @param {Int} cardID - the unique identification number of the card being moved
	* @param {String} zoneName - the name of the zone to which the card is being moved to
	* @param {GameState} gs - the gamestate in which this event is taking place
	*/
	moveCardToZone: function(cardID, zoneName, gs)
	{
		var card = lookupCard(cardID, gs);
		var zone = lookupZone(zoneName, gs);
		var prevOwner = lookupZone(card.zone, gs);
		if (prevOwner)
		{
			for (var i = 0; i < prevOwner.cards.length; i++) {
				if (prevOwner.cards[i] === card.id)
				{
					prevOwner.cards.splice(i, 1);
				}
			};
		}
		zone.cards.push(card.id);
		card.zone = zone.name;

		gameLog("	Moved card: " + card.name + " (Id: " + card.id + ") from zone: " + prevOwner.name + " to zone: " + zone.name + ".");
	},
	/**
	* @method changeAttribute
	* @param {Object} obj - the object whose attribute value is being changed
	* @param {String} attributeName - the name of the attribute to be changed
	* @param {...} newValue - the new value being given to the object's attribute
	* @param {GameState} gs - the gamestate in which this event is taking place
	*/
	changeAttribute: function (obj, attributeName, newValue, gs)
	{
		/*do lookup*/
		obj.attributeName = newValue;
	},
	/**
	* @method endPhase
	* @param {GameState} gs - the gamestate in which this event is taking place
	*/
	endPhase: function (gs)
	{
		gameLog("End phase \"" + gs.currentPhase + "\".");
		var index = gameDescription.phases.indexOf(lookupPhase(gs.currentPhase, gameDescription));
		index ++;
		if (index >= gameDescription.phases.length)
		{
			index = 0;
			Event.endTurn(gs);
			gs.currentPhase = gameDescription.phases[0].name;
		}
		else
		{
			gs.currentPhase = gameDescription.phases[index].name;
		}

		gameLog("Begin phase \"" + gs.currentPhase + "\".");
		//Run initial function for phase
		window[lookupPhase(gs.currentPhase, gameDescription).init].apply(this, [gs]);

	},
	/**
	* @method endTurn
	* @param {GameState} gs - the gamestate in which this event is taking place
	*/
	endTurn: function (gs)
	{
		var player = lookupPlayer(gs.turnPlayer, gs);
		gameLog("End of " + player.name + "'s turn.");
		var index = gs.players.indexOf(player);
		index ++;
		if (index >= gs.players.length)
		{
			index = 0;
		}
		gs.turnPlayer = gs.players[index].name;

		gameLog("Begin " + gs.turnPlayer + "'s turn.");

		player = lookupPlayer(gs.turnPlayer, gs)
		//Run AI if it is AI's turn
		if (player.isAI)
		{
			runAI_random(player, gs, gameDescription, 10);
		}
	}
};