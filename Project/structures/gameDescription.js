/* Initial Conditions for the game structure*/

function GameDescription (zones, cardTypes, actionTemplates, players, init, winCondition, functionFile, setupFunction, stateScore, phases) {
	var playerArr = [];
	for (var i = 0; i < players.length; i++) {
		var curPlayer = players[i];
		var newPlayer = new Player (curPlayer.name, curPlayer.attributes, curPlayer.zones, curPlayer.isAI);
		playerArr.push(newPlayer);
	};

	var zoneArr = [];
	for (var i = 0; i < zones.length; i++) {
		var curZone = zones[i];
		var newZone = new Zone (curZone.name, curZone.attributes, curZone.type, curZone.visibleTo);
		zoneArr.push(newZone);
	};

	this.zones = zoneArr;
	this.cardTypes = cardTypes;
	this.actionTemplates = actionTemplates;
	this.players = playerArr;
	this.init = init;
	this.winCondition = winCondition;
	this.functionFile = functionFile;
	this.setupFunction = setupFunction;
	this.stateScore = stateScore;
	this.phases = phases;
	this.cards = [];
}

//Creates the starting game state based on this game structure
GameDescription.prototype.initializeGameState = function() {
	var newGS = new GameState(
		this.players,
		this.zones,
		[],
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
		else if (this.init[i].zonesPerLine)
		{
			ZONES_PER_LINE = this.init[i].zonesPerLine;
		}
	}
};

function initCard (cardType, zone) {
	var card = new Card(cardType.name, zone.name, cardType.attributes, cardType.actions)
	return card;
}