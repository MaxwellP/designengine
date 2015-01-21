/* Gamestate: the state of the dynamic elements of the game */
function GameState (players, zones, cards, currentPhase, turnPlayer) {
	this.players = players;
	this.zones = zones;
	this.cards = cards;
	this.currentPhase = currentPhase;
	this.turnPlayer = turnPlayer;
}