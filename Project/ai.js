

function CopyCurrentGameState () {
	var copy_zones = objectClone(zones);
	var copy_cards = objectClone(cards);
	var copy_moveTemplates = objectClone(moveTemplates);
	var copy_players = objectClone(players);///////
	var copy_init = objectClone(init);
	var copy_winCondition = objectClone(winCondition);

	var stateCopy = new GameState(copy_zones, copy_cards, copy_moveTemplates, copy_players, copy_init, copy_winCondition);
	return stateCopy;
}

//Constructor for GameState which contains the full state of the game (everything)
/*function GameState (sZones, sCards, sMTemplates, sPlayers, sInit, sWCond) {
	this.zones = sZones;
	this.cards = sCards;
	this.moveTemplates = sMTemplates;
	this.players = sPlayers;
	this.init = sInit;
	this.winCondition = sWCond;
}*/

function SetCurrentGameState (gState) {
	zones = gState.zones;
	cards = gState.cards;
	moveTemplates = gState.moveTemplates;
	players = gState.players;
	init = gState.init;
	winCondition = gState.winCondition;
}

//Constructor for StateNode which contain:
// - the game state
// - a list of substates
// - what moves are needed to go to those substates
function StateNode (gState) {
	this.gameState = gState;
	//Parallel arrays
	this.branches = [];
	this.moves = [];

	//true if reached maxDepth on this node
	this.searchOver = false;
}

function createMoveTreeFromCurrent (maxDepth, curPlayer, altPlayer) {
	return createMoveTree(maxDepth, CopyCurrentGameState(), curPlayer, altPlayer);
}

function createMoveTree (maxDepth, startState, curPlayer, altPlayer) {
	var initRoot = new StateNode(startState);
	return createMoveBranch(maxDepth, initRoot, curPlayer, altPlayer);
}

//maxDepth - how deep to search before giving up
//startState - state to start searching from
//curPlayer - player to take move from this state
//altPlayer - other player
function createMoveBranch (maxDepth, startNode, curPlayer, altPlayer) {

	//Stop when maxDepth reached
	if (maxDepth <= 0)
	{
		startNode.searchOver = true;
		return startNode;
	}

	var originalState = CopyCurrentGameState();

	//var root = new StateNode(startNode.gameState);
	
	//Get legal moves from this state
	var legalMoves = getLegalMoves(curPlayer);
	startNode.moves = legalMoves;

	//Get all sub states from this state by iterating over moves
	for (var i = 0; i < startNode.moves.length; i++) {
		//Reset state to start state
		SetCurrentGameState(startNode.gameState);
		//Take the current move
		assignMove(startNode.moves[i], curPlayer);
		//Save the result of that move in a newNode
		startNode.branches[i] = new StateNode(CopyCurrentGameState());
	}

	//Recurse on sub states: reduce maxDepth, toggle between players
	for (var i = 0; i < startNode.branches.length; i++) {
		startNode.branches[i]
		createMoveBranch(maxDepth - 1, startNode.branches[i], altPlayer, curPlayer)
	};


	SetCurrentGameState(originalState);
}