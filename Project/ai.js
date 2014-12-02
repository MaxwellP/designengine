
function alphaBetaMax (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	console.log("abMax" + curPlNum + ", " + altPlNum);
	if (depthLevel == 0)
	{
		return evaluate(curPlNum, altPlNum, gs);
	}
	var tempGS = owl.deepCopy(gs);
	var legalMoves = getLegalMoves(tempGS.players[curPlNum], tempGS);
	legalMoves.forEach(function (move) {
		console.log(move);
		assignMove(move, tempGS.players[curPlNum], tempGS);
		console.log("calling abMin");
		var score = alphaBetaMin(alpha, beta, depthLevel - 1, tempGS, altPlNum, curPlNum);
		if (score >= beta)
		{
			return beta;
		}
		if (score > alpha)
		{
			alpha = score;
		}
	});
	return alpha;
}

function alphaBetaMin (alpha, beta, depthLevel, gs, curPlNum, altPlNum) {
	console.log("abMin" + curPlNum + ", " + altPlNum);
	if (depthLevel == 0)
	{
		return -evaluate(curPlNum, altPlNum, gs);
	}
	var tempGS = owl.deepCopy(gs);
	var legalMoves = getLegalMoves(tempGS.players[curPlNum], tempGS);
	legalMoves.forEach(function (move) {
		assignMove(move, tempGS.players[curPlNum], tempGS);
		console.log("calling abMax");
		var score = alphaBetaMax(alpha, beta, depthLevel - 1, tempGS, altPlNum, curPlNum);
		if (score <= alpha)
		{
			return alpha;
		}
		if (score < beta)
		{
			beta = score;
		}
	});
	return beta;
}

function evaluate(curPlNum, altPlNum, gs)
{
	var curPlayer = gs.players[curPlNum];
	var altPlayer = gs.players[altPlNum];

	var result = eval(winCondition).apply(this, [gs]).name;

	if (result == curPlayer.name)
	{
		console.log("Inf");
		return Infinity;
	}
	else if (result == altPlayer.name)
	{
		console.log("-Inf");
		return -Infinity;
	}
	else
	{
		console.log(result);
		return 0;
	}
};