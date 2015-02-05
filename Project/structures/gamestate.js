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