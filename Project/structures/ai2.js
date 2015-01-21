
function pickRandomLegalAction (player, gs) {
	var legalMoves = getLegalMoves(player, gs);
	if (legalMoves.length == 0)
	{
		console.log("NO LEGAL MOVES");
		return false;
	}
	return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}

function runAI (player, gs, gd, limit) {
	if (limit < 0)
	{
		console.log("Reached loop limit");
		return;
	}

	var randomAction = pickRandomLegalAction(player, gs);
	applyAction(randomAction);

	if (gs.turnPlayer == player.name)
	{
		runAI(player, gs, gd, limit - 1);
	}
}