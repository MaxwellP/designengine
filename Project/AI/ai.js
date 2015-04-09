var aiActionAfterRender = false;

function aiDoAction () {
	run_current_ai(currentGS.turnPlayer, currentGS, gameDescription, MAX_CONSEC_TURNS);
}


function run_current_ai (playerName, gs, gd, limit) {
	run_ISMCTS(playerName, gs, gd, limit);
}


var currentlySimulating = false;

var DEPTH = 3;

var MAX_CONSEC_TURNS = 10;

var loggingAI = false;

function aiLog (string) {
	if (loggingAI)
	{
		console.log(string);
	}
}

function LogTree (node, depth) {
	var indent = "";
	for(var i = 0; i < depth; i += 1)
	{
		indent += " ";
	}
	aiLog(indent + "Reward: " + node.totalReward + ", Visits: " + node.numVisits);
	for(var i = 0; i < node.children.length; i += 1)
	{
		LogTree(node.children[i], depth + 1);
	}
}

function pickRandomLegalAction (player, gs) {
	var legalActions = getLegalActions(player, gs);
	if (legalActions.length == 0)
	{
		//aiLog("NO LEGAL ACTIONS");
		return false;
	}
	return legalActions[Math.floor(Math.random() * legalActions.length)];
}

function runAI_random (player, gs, gd, limit) {
	if (limit < 0)
	{
		aiLog("Reached loop limit");
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
		aiLog("Reached loop limit");
		return;
	}
	var altPlayerObj = getAltPlayer(playerName, gs);

	currentlySimulating = true;
	var action = getBestAction(gs, gd, DEPTH, playerName, altPlayerObj.name);
	currentlySimulating = false;
	
	//Apply action here
	if (!action)
	{
		aiLog("No action found. (Game ended)");
		return;
	}
	applyAction(action, lookupPlayer(playerName, gs), gs);

	if (gs.turnPlayer == playerName)
	{
		aiLog("looping on runAI_abnm");
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
		//aiLog("Loop negamax because same turn player");
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


	var winner = window["gameWinCondition"].apply(this, [gs]).name;

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
		var score = window["gameStateScore"].apply(this, [curPlayerName, gs]);
		return score;
	}
}

//Second version of evaluate that only returns between 0 and 1
function evaluate_B (curPlayerName, altPlayerName, gs, gd)
{
	var curPlayer = lookupPlayer (curPlayerName, gs);
	var altPlayer = lookupPlayer (altPlayerName, gs);


	var winner = window["gameWinCondition"].apply(this, [gs]).name;

	if (winner == curPlayer.name)
	{
		return 1;
	}
	else if (winner == altPlayer.name)
	{
		return 0;
	}
	else
	{
		var score = window["gameStateScore"].apply(this, [curPlayerName, gs]);

		//*** Change this to return score once stateScore returns between 0 and 1
		return 0.5;
		//return score;
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

function Test_ISMCTS () {
	run_ISMCTS("P1", currentGS, gameDescription, 10);
}

//Call this from inside the game loop
function run_ISMCTS (playerName, gs, gd, limit) {
	if (limit < 0)
	{
		aiLog("Reached loop limit");
		return;
	}
	var altPlayerObj = getAltPlayer(playerName, gs);

	currentlySimulating = true;
	var action = ISMCTS(gs, gd, playerName, altPlayerObj.name);
	currentlySimulating = false;
	
	//Apply action here
	if (!action)
	{
		aiLog("No action found. (Game ended)");
		return;
	}
	applyAction(action, lookupPlayer(playerName, gs), gs);

	if (gs.turnPlayer == playerName)
	{
		aiLog("Still AI's turn: doing runAI_ISMCTS() again");
		//run_ISMCTS(playerName, gs, gd, limit - 1);
		aiActionAfterRender = true;
	}

	return;
}

//Information Set Monte Carlo Tree Search
//Returns the action that was most selected from the root
function ISMCTS (gs, gd, curPlayerName, altPlayerName) {

	//root node
	var root = new GSNode(gs, undefined);

	//do many iterations
	for (var i = 0; i < 500; i++)
	{
		if (i === 500)
		{
			//debugger;
		}
		ISMCTS_Traverse(root, gd, curPlayerName, altPlayerName)
	}

	//pick best action (most selected from root)
	var bestAction = undefined;
	var mostVisits = -1;

	for (var i = 0; i < root.children.length; i++)
	{
		var child = root.children[i];
		aiLog("Action " + i + " was traversed " + child.numVisits + " times");
		//aiLog(child.numVisits);
		if (child.numVisits > mostVisits)
		{
			bestAction = child.action;
			mostVisits = child.numVisits;
			aiLog("(Action " + i + " is current highest)");
		}
	}
	LogTree(root, 0);
	return bestAction;
}

function Bandit_UCB1 (reward, visits, parentVisits) {
	return (reward / visits) + 0.7 * Math.sqrt(Math.log(parentVisits) / visits);
}

//If there are any untried actions, do one of those
//Otherwise, select a child, choosing based on bandit algorithm
function ISMCTS_Traverse (node, gd, curPlayerName, altPlayerName) {

	//Add 1 to visit counter
	node.numVisits += 1;

	if (node.untriedLegalActions.length > 0)
	{
		//Pick random untried action
		var randUntriedAction = node.untriedLegalActions[Math.floor(Math.random() * node.untriedLegalActions.length)];

		//Remove it from the list
		node.untriedLegalActions.splice(node.untriedLegalActions.indexOf(randUntriedAction), 1);

		//Determinization
		var newGS = node.gs.cloneAndRandomize(curPlayerName);

		//Apply the action to the new gamestate
		applyAction(randUntriedAction, lookupPlayer(newGS.turnPlayer, newGS), newGS);

		var newNode = new GSNode(newGS, randUntriedAction)

		newNode.numVisits = 1; //Start node with 1 visit

		//Add node to parent node's children array
		node.children.push(newNode);

		//Simulate outcome randomly (do random moves until the game ends)
		var simResult = ISMCTS_Simulation(node.gs, gd, curPlayerName, altPlayerName);

		newNode.totalReward += simResult;

		//Update all parent nodes
		return simResult;
	}
	else
	{
		//Select the child with the highest (exploitation + c * exploration) result
		var chosenChild = undefined;
		var highestResult = -1;
		for (var i = 0; i < node.children.length; i++)
		{
			var child = node.children[i]
			var banditResult = Bandit_UCB1(child.totalReward, child.numVisits, node.numVisits);
			//var banditResult = (child.totalReward / child.numVisits) + 0.7 * Math.sqrt(Math.log(node.numVisits) / child.numVisits);
			if (banditResult > highestResult)
			{
				highestResult = banditResult;
				chosenChild = child;
			}
		}
		if (chosenChild != undefined)
		{
			var simResult = ISMCTS_Traverse(chosenChild, gd, curPlayerName, altPlayerName);
			chosenChild.totalReward += simResult;
			//Keep passing reward up through parent nodes
			return simResult;
		}
		else
		{
			//No children available and no untried actions
			//aiLog("REACHED BOTTOM OF TREE");
			var simResult = ISMCTS_Simulation(node.gs, gd, curPlayerName, altPlayerName);
			return simResult;
		}
	}
}

//From a state, apply random moves until the game is ended (or limit reached)
//Returns terminal results (win/loss)
function ISMCTS_Simulation (gs, gd, curPlayerName, altPlayerName) {
	//aiLog("* Randomly simulating rest of game");
	var simGS = gs.clone()
	//Game lasting longer than 100 turns - just evaluate at that point
	var limit = 100;
	while (!isGameOver(simGS, gd) && limit > 0)
	{
		limit --;

		var player = lookupPlayer(simGS.turnPlayer, simGS);
		var randomAction = pickRandomLegalAction(player, simGS);
		if (randomAction)
		{
			applyAction(randomAction, player, simGS);
		}
	}
	if (isGameOver(simGS, gd))
	{
		var result = evaluate_B(curPlayerName, altPlayerName, simGS, gd);
		//aiLog("* Game simulated - reward of " + result);
		//*** Get win/loss
		return result;
	}
	else
	{
		//aiLog("* Game unfinished - reward of 0.5")
		//*** Evaluate state
		return evaluate_B(curPlayerName, altPlayerName, simGS, gd);
	}
}

//test