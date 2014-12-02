
var bestMove = undefined;
var startDepth = undefined;

//Alpha beta search
function alphaBetaMax (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	if (depthLevel == 0)
	{
		return evaluate(curPlNum, altPlNum, gs);
	}
	var legalMoves = getLegalMoves(gs.players[curPlNum], gs);
	for (var i = 0; i < legalMoves.length; i++) {
		//Make a new copy of the game state
		var tempGS_b = owl.deepCopy(gs);
		//Get the same move but in this copy of the game state
		var move_b = getLegalMoves(tempGS_b.players[curPlNum], tempGS_b)[i];
		//Take the move
		assignMove(move_b, tempGS_b.players[curPlNum], tempGS_b);
		//Evaluate score
		var score = alphaBetaMin(alpha, beta, depthLevel - 1, tempGS_b, altPlNum, curPlNum);
		if (score >= beta)
		{
			return beta;
		}
		if (score > alpha)
		{
			alpha = score;
			//console.log("Found better move with score " + score);
			bestMove = move_b;
		}
	};

	return alpha;
}

//Opposite function to alphaBetaMax
function alphaBetaMin (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	if (depthLevel == 0)
	{
		return -evaluate(curPlNum, altPlNum, gs);
	}
	var legalMoves = getLegalMoves(gs.players[curPlNum], gs);
	for (var i = 0; i < legalMoves.length; i++) {
		var tempGS_b = owl.deepCopy(gs);
		var move_b = getLegalMoves(tempGS_b.players[curPlNum], tempGS_b)[i];
		assignMove(move_b, tempGS_b.players[curPlNum], tempGS_b);
		var score = alphaBetaMax(alpha, beta, depthLevel - 1, tempGS_b, altPlNum, curPlNum);
		if (score <= alpha)
		{
			return alpha;
		}
		if (score < beta)
		{
			beta = score;
		}
	};
	return beta;
}

function evaluate(curPlNum, altPlNum, gs)
{
	var curPlayer = gs.players[curPlNum];
	var altPlayer = gs.players[altPlNum];

	var result = eval(winCondition).apply(this, [gs]).name;

	if (result == curPlayer.name)
	{
		return Infinity;
	}
	else if (result == altPlayer.name)
	{
		return -Infinity;
	}
	else
	{
		return 0;
	}
};

function testAI () {
	//Test ai from the perspective of the player
	var startDepth = 3;
	var result = alphaBetaMax(-Infinity, Infinity, 3, currentGS, 0, 1);
	console.log(result);
	console.log(bestMove);
}

function tryAI (gs) {
	bestMove = undefined;
	alphaBetaMax(-Infinity, Infinity, 3, gs, 1, 0);
	//sets up bestMove
	if (bestMove)
	{
		var legalMoves = getLegalMoves(gs.players[1], gs);
		for (var i = 0; i < legalMoves.length; i++) {
			if (legalMoves[i].description == bestMove.description)
			{
				return legalMoves[i];
			}
		};
	}
	console.log("AI did not find a legal move");
	return false;
}
