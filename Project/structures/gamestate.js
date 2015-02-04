/* Gamestate: the state of the dynamic elements of the game */
function GameState (players, zones, cards, currentPhase, turnPlayer) {
	this.players = players;
	this.zones = zones;
	this.cards = cards;
	this.currentPhase = currentPhase;
	this.turnPlayer = turnPlayer;
}

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