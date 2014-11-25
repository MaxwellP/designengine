
//check legality uses the global state??

function getLegalMoves_sim(state, player)
{
	var legalMoves = []	;
	for (var h = 0; h < player.cards.length; h++) {
		var currentMoves = generateMovesFromCard_sim(player.cards[h]);
		for (var i = 0; i < currentMoves.length; i++) {
			if (eval(currentMoves[i].checkLegality).apply(this, currentMoves[i].arguments))
			{
				legalMoves.push(currentMoves[i]);
			}
		};
	}
	return legalMoves;
}





function CopyCurrentGameState () {
	var copy_zones = objectClone(zones);
	var copy_cards = objectClone(cards);
	var copy_moveTemplates = objectClone(moveTemplates);
	var copy_players = objectClone(players);
	var copy_init = objectClone(init);
	var copy_winCondition = objectClone(winCondition);

	var stateCopy = new GameState(copy_zones, copy_cards, copy_moveTemplates, copy_players, copy_init, copy_winCondition);
	return stateCopy;
}

//Constructor for GameState which contains the full state of the game (everything)
function GameState (sZones, sCards, sMTemplates, sPlayers, sInit, sWCond) {
	this.zones = sZones;
	this.cards = sCards;
	this.moveTemplates = sMTemplates;
	this.players = sPlayers;
	this.init = sInit;
	this.winCondition = sWCond;
}

//Constructor for StateNode which contain:
// - the game state
// - a list of substates
// - what moves are needed to go to those substates
function StateNode (gState) {
	this.gameState = gState;
	//Parallel arrays
	this.subStates = [];
	this.moves = [];
}

function createMoveTree (maxDepth, startState) {
	var root = new StateNode(startState);


}