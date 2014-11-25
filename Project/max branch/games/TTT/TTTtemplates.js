
function TTTzone(zoneLocationX, zoneLocationY, zoneCards)
{
	this.locationX = zoneLocationX;
	this.locationY = zoneLocationY;
	this.cards = zoneCards;
};

function TTTmoves(movesTemplateName, movesArguments)
{
	this.templateName = movesTemplateName;
	this.arguments = movesArguments;
};

function TTTcard(cardName, cardValue, cardMoves)
{
	this.name = cardName;
	this.value = cardValue;
	this.moves = cardMoves;
};

function TTTmoveTemplate(moveTemplateName, moveTemplateNumArguments, moveTemplateResult, moveTemplateLegality)
{
	this.templateName = moveTemplateName;
	this.numArgs = moveTemplateNumArguments;
	this.result = moveTemplateResult;
	this.checkLegality = moveTemplateLegality;
};

function TTTplayer(playerName, playerCards)
{
	this.name = playerName;
	this.cards = playerCards;
};

function TTTinitPlayers(initPlayersName, initPlayersCardNames)
{
	this.playerName = initPlayersName;
	this.cardNames = initPlayersCardNames;
};

function TTTinitZonesPerLine(numZonesPerLine)
{
	this.zonesPerLine = numZonesPerLine;
};

function singleLineStringifyFunction (func)
{
	return (func + "").split("\n").join("").split("\t").join("").split("\r").join("");
};

function isValidJSON(str)
{
	try
	{
		JSON.parse(str);
	}
	catch (e)
	{
		return false;
	}
	return true;
}