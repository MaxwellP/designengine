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

	return action;
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

//Use the abNegamax function
function getBestAction (gs, gd, maxDepth, curPlayerName, altPlayerName) {
	var result = abNegamax(gs, gd, maxDepth, 0, -Infinity, Infinity, curPlayerName, altPlayerName);
	return result.action;
}

//Evaluate a game state
function evaluate(curPlayerName, altPlayerName, gs, gd)
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
};