/**
* Initial conditions for the game structure
*
* @class GameDescription
* @constructor
* @param {Array} zones - an array of zones defined in the designer's json file
* @param {Array} cardTypes - an array of card types defined in the designer's json file
* @param {Array} actionTemplates - an array of action templates defined in the designer's json file
* @param {Array} players - an array of players defined in the designer's json file
* @param {Function} init - 
* @param {Function} winCondition - a designer defined function that returns when a game state is considered a termination state and who the victor is in that state
* @param {String} functionFile - the name of the file containing all designer defined functions
* @param {Function} setupFunction - a designer defined function that is run at the start of a game
* @param {Function} stateScore - a designer defined function run at the start of a game
* @param {Array} phases - an array of zones defined in the designer's json file
*/
function GameDescription (zones, universes, cardTypes, actionTemplates, playerTemplate, players, init, winCondition, functionFile, setupFunction, stateScore, phases) {
	var playerArr = [];
	for (var i = 0; i < players.length; i++) {
		var curPlayer = players[i];
		var playerZones = {};
		for (var j = 0; j < playerTemplate.zoneTags.length; j++)
		{
			playerZones[playerTemplate.zoneTags[j]] = curPlayer.zones[j];
		}
		var playerAttributes = {};
		for (var j = 0; j < playerTemplate.attributeNames.length; j++)
		{
			playerAttributes[playerTemplate.attributeNames[j]] = curPlayer.attributes[j];
		}
		var newPlayer = new Player (curPlayer.name, playerAttributes, playerZones, curPlayer.isAI, false, playerTemplate.actions);
		playerArr.push(newPlayer);
	};

	var zoneArr = [];
	for (var i = 0; i < zones.length; i++) {
		var curZone = zones[i];
		var newZone = new Zone (curZone.name, curZone.attributes, curZone.type, curZone.visibleTo);
		zoneArr.push(newZone);
	};

	this.zones = zoneArr;
	this.universes = universes;
	this.cardTypes = cardTypes;
	this.actionTemplates = actionTemplates;
	this.playerTemplate = playerTemplate;
	this.players = playerArr;
	this.init = init;
	this.winCondition = winCondition;
	this.functionFile = functionFile;
	this.setupFunction = setupFunction;
	this.stateScore = stateScore;
	this.phases = phases;
	this.cards = [];
}
/**
* Creates a clean game state
* @method GameDescription.prototype.initializeGameState
* @return {GameState} Returns the starting game state based on this game structure
*/
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
/**
* Creates and places the cards into the zones
* @method GameDescription.prototype.initializeCards
*/
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
/**
* Creates a new card of the given card type and places it in the given zone
* @method initCard
* @param {String} cardType - he name of the card type to create a new card based on
* @param {Zone} zone - the zone into which the new car should be placed in
* @return {Card} Returns the newly created card
*/
function initCard (cardType, zone) {
	var card = new Card(cardType.name, zone.name, cardType.attributes, cardType.actions, false, cardType.universe)
	return card;
}