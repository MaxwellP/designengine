
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

function runAI_abnm (player, gs, gd, limit) {
	if (limit < 0)
	{
		console.log("Reached loop limit");
		return;
	}
	//*** Is it player or player.name?
	//****** HOW TO GET ALTPLAYERNAME???? look it up
	var action = getBestMove(gs, gd, 2, player, altPlayerName);
	if (gs.turnPlayer == player.name)
	{
		runAI_abnm(player, gs, gd, limit - 1);
	}
}

//Score + Action object
function ScoreAction (score, action) {
	this.score = score;
	this.action = action;
}

//AB Negamax
function abNegamax (gs, gd, maxDepth, currentDepth, alpha, beta, curPlayerName, altPlayerName) {
	//Game is over or done recursing
	if (isGameOver(gs, gd) || currentDepth == maxDepth)
	{
		return new ScoreAction(evaluate(player), undefined);
	}

	//Get values from below

	var bestAction = undefined;
	var bestScore = -Infinity;

	//Loop through possible actions
	var actions = getLegalActions(lookupPlayer(curPlayerName, gs), gs);
	for (var i = 0; i < actions.length; i++)
	{
		var action = actions[i];
		var newGS = objectClone(gs);
		//Apply the action to the new gamestate
		applyAction(action, newGS);

		//Recursion - use new game state, increase depth, swap and invert alpha / beta and consider new best scores, swap current/alternate players

		//*** Needs to be changed to account for multiple actions by one player?
		var recurse = abNegamax(newGS, gd, maxDepth, currentDepth + 1, - beta, - Math.max(alpha, bestScore), altPlayerName, curPlayerName);
		var recScore = recurse.score;
		var currentMove = recurse.currentMove;
		var currentScore = -recurse.score

		if (currentScore > bestScore)
		{
			bestScore = currentScore;
			bestMove = move;

			if (bestScore >= beta)
			{
				return new ScoreAction(bestScore, bestMove);
			}
		}
	}
	return new ScoreAction(bestScore, bestMove);
}

//Use the abNegamax function
function getBestMove (gs, gd, maxDepth, curPlayerName, altPlayerName) {
	var result = abNegamax(gs, gd, maxDepth, 0, -Infinity, Infinity, curPlayerName, altPlayerName);
	return result.move;
}

//Evaluate a game state
function evaluate(curPlayerName, altPlayerName, gs)
{
	var curPlayer = lookupPlayer (curPlayerName, gs);
	var altPlayer = lookupPlayer (altPlayerName, gs);


	//This whole thing needs to be fixed

	var result = window[winCondition].apply(this, [gs]).name;

	if (result == curPlayer.name)
	{
		return 5000;
	}
	else if (result == altPlayer.name)
	{
		return -5000;
	}
	else
	{
		var scores = window[stateScore].apply(this, [gs]);
		return scores[curPlNum];
	}
};