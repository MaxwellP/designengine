var currentlySimulating = false;

var DEPTH = 3;

var MAX_CONSEC_TURNS = 10;

function pickRandomLegalAction (player, gs) {
	var legalActions = getLegalActions(player, gs);
	if (legalActions.length == 0)
	{
		console.log("NO LEGAL ACTIONS");
		return false;
	}
	return legalActions[Math.floor(Math.random() * legalActions.length)];
}

function runAI_random (player, gs, gd, limit) {
	if (limit < 0)
	{
		console.log("Reached loop limit");
		return;
	}

	var randomAction = pickRandomLegalAction(player, gs);
	applyAction(randomAction, player, gs);

	if (gs.turnPlayer == player.name)
	{
		runAI_random(player, gs, gd, limit - 1);
	}
}

function TestAI () {
	return runAI_abnm("P2", currentGS, gameDescription, 10);
}

function runAI_abnm (playerName, gs, gd, limit) {
	if (limit < 0)
	{
		console.log("Reached loop limit");
		return;
	}
	var altPlayerObj = getAltPlayer(playerName, gs);

	currentlySimulating = true;
	var action = getBestAction(gs, gd, DEPTH, playerName, altPlayerObj.name);
	currentlySimulating = false;
	
	//Apply action here
	if (!action)
	{
		console.log("No action found. (Game ended)");
		return;
	}
	applyAction(action, lookupPlayer(playerName, gs), gs);

	if (gs.turnPlayer == playerName)
	{
		console.log("looping on runAI_abnm");
		runAI_abnm(playerName, gs, gd, limit - 1);
	}

	return;// action;
}

//Use the abNegamax function
function getBestAction (gs, gd, maxDepth, curPlayerName, altPlayerName) {
	var result = abNegamax(gs, gd, maxDepth, 0, -Infinity, Infinity, curPlayerName, altPlayerName);
	return result.action;
}

//Score + Action object
function ScoreAction (score, action) {
	this.score = score;
	this.action = action;
}

//AB Negamax
function abNegamax (gs, gd, maxDepth, currentDepth, alpha, beta, curPlayerName, altPlayerName) {
	if (curPlayerName != gs.turnPlayer)
	{
		//console.log("Loop negamax because same turn player");
		return abNegamax(gs, gd, maxDepth, currentDepth, - beta, - alpha, altPlayerName, curPlayerName);
	}

	//Game is over or done recursing
	if (isGameOver(gs, gd) || currentDepth == maxDepth)
	{
		return new ScoreAction(evaluate(curPlayerName, altPlayerName, gs, gd), undefined);
	}

	//Get values from below

	var bestAction = undefined;
	var bestScore = -Infinity;
	
	var curPlayerObj = lookupPlayer(curPlayerName, gs)

	//Loop through possible actions
	var actions = getLegalActions(curPlayerObj, gs);
	for (var i = 0; i < actions.length; i++)
	{
		var action = actions[i];
		var newGS = gs.clone();
		//Apply the action to the new gamestate
		applyAction(action, curPlayerObj, newGS);

		//Recursion - use new game state, increase depth, swap and invert alpha / beta and consider new best scores, swap current/alternate players

		//*** Needs to be changed to account for multiple actions by one player?

		var recurse = abNegamax(newGS, gd, maxDepth, currentDepth + 1, - beta, - Math.max(alpha, bestScore), altPlayerName, curPlayerName);

		//var recScore = recurse.score;
		//var currentAction = recurse.action;
		var currentScore = -recurse.score

		if (currentScore > bestScore)
		{
			bestScore = currentScore;
			bestAction = action;

			if (bestScore >= beta)
			{
				return new ScoreAction(bestScore, bestAction);
			}
		}
	}
	return new ScoreAction(bestScore, bestAction);
}

//Evaluate a game state
function evaluate (curPlayerName, altPlayerName, gs, gd)
{
	var curPlayer = lookupPlayer (curPlayerName, gs);
	var altPlayer = lookupPlayer (altPlayerName, gs);


	//This whole thing needs to be fixed

	var winner = window[gd.winCondition].apply(this, [gs]).name;

	if (winner == curPlayer.name)
	{
		return 5000;
	}
	else if (winner == altPlayer.name)
	{
		return -5000;
	}
	else
	{
		var score = window[gd.stateScore].apply(this, [curPlayerName, gs]);
		return score;
	}
}

//gs - game state of the node
//action - action that led to this state
function GSNode (gs, action) {
	this.gs = gs;
	this.action = action;

	//Legal actions available from this state, that haven't already been tried (Removed after being tried)
	this.untriedLegalActions = getLegalActions(lookupPlayer(gs.turnPlayer, gs), gs);

	//Child states accessible from this state
	this.children = [];

	this.totalReward = 0;
	this.numVisits = 0;
}

//Call this from inside the game loop
function run_ISMCTS (playerName, gs, gd, limit) {
	if (limit < 0)
	{
		console.log("Reached loop limit");
		return;
	}
	var altPlayerObj = getAltPlayer(playerName, gs);

	currentlySimulating = true;
	var action = ISMCTS(gs, gd, playerName, altPlayerObj.name);
	currentlySimulating = false;
	
	//Apply action here
	if (!action)
	{
		console.log("No action found. (Game ended)");
		return;
	}
	applyAction(action, lookupPlayer(playerName, gs), gs);

	if (gs.turnPlayer == playerName)
	{
		console.log("looping on runAI_ISMCTS");
		run_ISMCTS(playerName, gs, gd, limit - 1);
	}

	return;
}

//Information Set Monte Carlo Tree Search
//Returns the action that was most selected from the root
function ISMCTS (gs, gd, curPlayerName, altPlayerName) {

	//root node
	var root = new GSNode(gs, undefined);

	//do many iterations
	for (var i = 0; i < 100; i++)
	{
		ISMCTS_Traverse(root, gd, curPlayerName, altPlayerName)
	}

	//pick best action (most selected from root)
	var bestAction = undefined;
	var mostPasses = -1;

	for (var i = 0; i < root.children.length; i++)
	{
		var child = root.children[i];
		if (child.numVisits)
	}
}

//If there are any untried actions, do one of those
//Otherwise, select a child, choosing based on bandit algorithm
function ISMCTS_Traverse (node, gd, curPlayerName, altPlayerName) {
	if (node.untriedLegalActions.length > 0)
	{
		//Pick random untried action
		var randUntriedAction = node.untriedLegalActions[Math.floor(Math.random() * node.untriedLegalActions.length)];

		var newGS = gs.clone();
		//Apply the action to the new gamestate
		applyAction(randUntriedAction, curPlayerObj, newGS);

		var newNode = GSNode(randUntriedAction)

		//Simulate outcome randomly (do random moves until the game ends)
		ISMCTS_Simulation(node.gs, gd, curPlayerName, altPlayerName);

		//Update 
	}
	else
	{
		//Select the child with the highest (exploitation + c * exploration) result
		var chosenChild = undefined;
		var highestResult = -1;
		for (var i = 0; i < node.children.length; i++) {
			var child = node.children[i]
			var banditResult = (child.totalReward / child.numVisits) + 0.7 * Math.sqrt(Math.log(node.numVisits) / child.numVisits);
			if (banditResult > highestResult)
			{
				chosenChild = child;
			}
		};
		ISMCTS_Traverse(chosenChild, gd, curPlayerName, altPlayerName);
	}
}

//From a state, apply random moves until the game is ended (or limit reached)
//Returns terminal results (win/loss)
function ISMCTS_Simulation (gs, gd, curPlayerName, altPlayerName) {

	//Game lasting longer than 50 turns - just evaluate at that point
	var limit = 50;
	while (!isGameOver(gs, gd) && limit > 0)
	{
		limit --;

		var player = lookupPlayer(gs.turnPlayer, gs);
		var randomAction = pickRandomLegalAction(gs.turnPlayer, gs);
		applyAction(randomAction, player, gs);


		pickRandomLegalAction(gs.turnPlayer, gs);
		runAI_random (gs.turnPlayer, gs, gd, limit)
	}
	if (isGameOver(gs, gd))
	{
		//*** Get win/loss
		return;
	}
	else
	{
		//*** Evaluate state
		return evaluate(curPlayerName, altPlayerName, gs, gd);
		
	}
}


//TODO: Change evaluate() to return between 0 and 1 (?)