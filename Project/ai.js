
var bestMove = undefined;
var bestMoveNum = undefined;
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
		var tempGS = objectClone(gs);//owl.deepCopy(gs);
		//Get the same move but in this copy of the game state
		var move = getLegalMoves(tempGS.players[curPlNum], tempGS)[i];
		//Copy the move just in case it happens to be the Best Move
		var moveCopy = objectClone(move);
		//Take the move
		assignMove(move, tempGS.players[curPlNum], tempGS);
		//Evaluate score
		var score = alphaBetaMin(alpha, beta, depthLevel - 1, tempGS, altPlNum, curPlNum);
		if (score >= beta)
		{
			return beta;
		}
		if (score > alpha)
		{
			alpha = score;
			//console.log("Found better move with score " + score);
			bestMove = moveCopy;
			bestMoveNum = i;
			//console.log(bestMove);
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
		var tempGS = objectClone(gs);//owl.deepCopy(gs);
		var move = getLegalMoves(tempGS.players[curPlNum], tempGS)[i];
		assignMove(move, tempGS.players[curPlNum], tempGS);
		var score = alphaBetaMax(alpha, beta, depthLevel - 1, tempGS, altPlNum, curPlNum);
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
var COOL = false;
function tryAI (gs) {
	bestMove = undefined;
	alphaBetaMax(-Infinity, Infinity, 3, gs, 1, 0);
	//sets up bestMove
	if (bestMove)
	{
		var bmStr = JSON.stringify(bestMove);
		var legalMoves = getLegalMoves(gs.players[1], gs);
		
		for (var i = 0; i < legalMoves.length; i++)
		{
			var lmStr = JSON.stringify(legalMoves[i]);
			if (bmStr == lmStr)
			{
				return legalMoves[i];
			}
		}
	}
	console.log("AI did not find a legal move that it liked");
	return false;
}
