
var bestMove = undefined;
var bestMoveNum = undefined;
var startDepth = undefined;



function minimaxSearch (depthLevel, gs, curPlNum, altPlNum, maximizingPlayer) {
	var gsScore = evaluate(curPlNum, altPlNum, gs);
	if (!maximizingPlayer)
	{
		gsScore = -gsScore;
	}
	if (gsScore != 0)
	{
		//Terminal state
		return gsScore;
	}
	if (depthLevel == 0)
	{
		//End of search
		return gsScore;
	}
	var legalMoves = getLegalMoves(gs.players[curPlNum], gs);
	if (legalMoves.length == 0)
	{
		return 0;
	}

	var bestScore;
	if (maximizingPlayer)
	{
		bestScore = -Infinity;
	}
	else
	{
		bestScore = Infinity;
	}

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
		var score = minimaxSearch(depthLevel - 1, tempGS, altPlNum, curPlNum, !maximizingPlayer);
		
		if (maximizingPlayer)
		{
			if (score > bestScore)
			{
				bestScore = score;
				if (depthLevel == startDepth)
				{
					bestMove = moveCopy;
					console.log("Found best move of score = " + bestScore);
				}
			}
		}
		else
		{
			if (score < bestScore)
			{
				bestScore = score;
				//bestMove = moveCopy;
			}
		}

		//console.log("" + score + "	" + depthLevel);
		//printGameState(tempGS);
		//console.log(score);
		
	};

	return bestScore;
}







//OLD >>>>>

//Alpha beta search
function alphaBetaMax (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	var gsScore = evaluate(curPlNum, altPlNum, gs);
	if (gsScore != 0)
	{
		//Terminal state
		return gsScore
	}
	if (depthLevel == 0)
	{
		//End of search
		return gsScore;
	}
	var legalMoves = getLegalMoves(gs.players[curPlNum], gs);

	var bestScore = -Infinity;

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
		if (depthLevel == startDepth)
		{
			console.log(score);
		}

		if (depthLevel == startDepth && score > bestScore)
		{
			bestScore = score;
			bestMove = moveCopy;
		}

		if (score >= beta)
		{
			/*if (depthLevel == startDepth)
			{
				bestMove = moveCopy;
				console.log("Got best move (score >= beta)");
			}
			else
			{
				//console.log("Not at depth");
			}*/
			return beta;
		}
		if (score > alpha)
		{
			/*if (depthLevel == startDepth && bestMove == undefined)
			{
				bestMove = moveCopy;
				console.log("Got best move (score > alpha && bestMove undefined)");
			}
			else
			{
				//console.log("Not at depth");
			}*/
			alpha = score;

			//console.log("Found better move with score " + score);
			//bestMoveNum = i;
			//console.log(bestMove);
		}
	};

	return alpha;
}

//Opposite function to alphaBetaMax
function alphaBetaMin (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	var gsScore = -evaluate(curPlNum, altPlNum, gs);
	if (gsScore != 0)
	{
		//Terminal state
		return gsScore
	}
	if (depthLevel == 0)
	{
		//End of search
		return gsScore;
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

/*function testAI () {
	console.log("TEST AI CALLED ");
	return;
	//Test ai from the perspective of the player
	var startDepth = 3;
	var result = alphaBetaMax(-Infinity, Infinity, 3, currentGS, 0, 1);
	console.log(result);
	console.log(bestMove);
}*/

function tryAI (gs) {
	console.log("===== Running the AI =====");
	bestMove = undefined;
	startDepth = 3;
	//alphaBetaMax(-Infinity, Infinity, startDepth, gs, 1, 0);

	minimaxSearch (startDepth, gs, 1, 0, true);
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
	else
	{
		console.log("(bestMove was undefined)");
		//debugger;
	}
	console.log("AI did not find a legal move that it liked");
	return false;
}
