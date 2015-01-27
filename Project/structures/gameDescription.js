/* Initial Conditions for the game structure*/

function GameDescription (zones, cardTypes, actionTemplates, players, init, winCondition, functionFile, stateScore, phases) {
	this.zones = zones;
	this.cardTypes = cardTypes;
	this.actionTemplates = actionTemplates;
	this.players = players;
	this.init = init;
	this.winCondition = winCondition;
	this.functionFile = functionFile;
	this.stateScore = stateScore;
	this.phases = phases;
	this.cards = [];
}

//Creates the starting game state based on this game structure
GameDescription.prototype.initializeGameState = function() {
	var newGS = new GameState(
		this.players,
		this.zones,
		this.cards,
		this.phases[0].name,
		this.players[0].name);
	this.initializeCards(newGS);
	return newGS;
};

//Creates and places the cards into the zones
GameDescription.prototype.initializeCards = function(gs) {

	for (var i = 0; i < this.init.length; i += 1)
	{
		if (this.init[i].zoneName)
		{
			var currentZone = lookupZone(this.init[i].zoneName, gs);
			if (currentZone)
			{
				for(var j = 0; j < this.init[i].cardNames.length; j += 1)
				{
					var currentCard = lookupCardType(this.init[i].cardNames[j], this);
					if (currentCard)
					{
						var newCard = initCard(currentCard, currentZone);
						currentZone.cards.push(newCard.id);
						gs.cards.push(newCard);
					}
				}
			}
		}
	}
};

function initCard (cardType, zone) {
	var card = new Card(cardType.name, zone.name, cardType.attributes, cardType.actions)
	return card;
}