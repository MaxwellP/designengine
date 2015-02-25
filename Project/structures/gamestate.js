/**
* The state of the dynamic elements of the game
*
* @class Gamestate
* @constructor
* @param {Array} players - an array of all players in the game
* @param {Array} zones - an array of all zones in the game
* @param {Array} cards - an array of all cards in the game
* @param {Phase} currentPhase - the current phase of the turn
* @param {Player} turnPlayer - the player whose turn it is
*/
function GameState (players, zones, cards, currentPhase, turnPlayer) {
	this.players = players;
	this.zones = zones;
	this.cards = cards;
	this.currentPhase = currentPhase;
	this.turnPlayer = turnPlayer;
}
/**
* Creates a new gamestate that is a copy of this gamestate
* @method GameState.prototype.clone
* @return {GameState} Returns the newly created gamestate
*/
GameState.prototype.clone = function() {

	var newPlayers = [];
	for (var i = 0; i < this.players.length; i++)
	{
		newPlayers.push(this.players[i].clone());
	}

	var newZones = [];
	for (var i = 0; i < this.zones.length; i++)
	{
		newZones.push(this.zones[i].clone());
	}

	var newCards = [];
	for (var i = 0; i < this.cards.length; i++)
	{
		newCards.push(this.cards[i].clone());
	}

	return new GameState(newPlayers, newZones, newCards, this.currentPhase, this.turnPlayer);
};

/**
* Creates a new gamestate that is a copy of this gamestate, with randomly determinized hidden information from a given observer's point of view
* @method GameState.prototype.cloneAndRandomize
* @param {String} observer - The name of the player to use as the observer (Randomize based on what information is hidden from observer)
* @return {GameState} Returns the newly created randomized gamestate
*/
GameState.prototype.cloneAndRandomize = function(observer) {

	var newPlayers = [];
	for (var i = 0; i < this.players.length; i++)
	{
		newPlayers.push(this.players[i].clone());
	}

	var newZones = [];
	for (var i = 0; i < this.zones.length; i++)
	{
		newZones.push(this.zones[i].clone());
	}

	var newCards = [];
	for (var i = 0; i < this.cards.length; i++)
	{
		newCards.push(this.cards[i].clone());
	}

	//TODO: Implement groups of cards to randomize separately
	//Currently: randomizes all hidden cards as if they were in the same group

	//Zones that the observer doesn't have information on
	var hiddenZones = [];
	//Array for remembering how many cards were in each zone (Parallel array)
	var cardsInZone = [];
	//Cards from each hidden zone
	var hiddenCards = [];
	for (var i = 0; i < newZones.length; i++)
	{
		var zone = newZones[i];
		//If zone isn't visible to the observer
		if (zone.visibleTo.indexOf(observer) == -1)
		{
			hiddenZones.push(zone);
			//Number of cards to put back into each zone
			cardsInZone.push(zone.cards.length);
			//Store all cards in hiddenCards
			hiddenCards = hiddenCards.concat(zone.cards.splice(0, zone.cards.length));
		}
	}

	//Shuffle cards in hiddenCards
	var currentIndex = hiddenCards.length;
	var tempVal;
	var randomIndex;
	while(0 != currentIndex)
	{
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		tempVal = hiddenCards[currentIndex];
		hiddenCards[currentIndex] = hiddenCards[randomIndex];
		hiddenCards[randomIndex] = tempVal;
	}

	//Put randomized cards back into zones
	for (var i = 0; i < hiddenZones.length; i++)
	{
		var zone = hiddenZones[i];
		var numCards = cardsInZone[i];

		zone.cards = zone.cards.concat(hiddenCards.splice(0, numCards));
	}

	//Return determinized gamestate
	return new GameState(newPlayers, newZones, newCards, this.currentPhase, this.turnPlayer);
};

