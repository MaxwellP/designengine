
function RPSzone(zoneName, zoneCards)
{
	this.name = zoneName;
	this.cards = zoneCards;
};

function RPSmoves(movesTemplateName, movesArguments)
{
	this.templateName = movesTemplateName;
	this.arguments = movesArguments;
};

function RPScard(cardName, cardValue, cardOwner, cardMoves)
{
	this.name = cardName;
	this.value = cardValue;
	this.owner = cardOwner;
	this.moves = cardMoves;
};

function RPSmoveTemplate(moveTemplateName, moveTemplateNumArguments, moveTemplateResult,  moveTemplateLegality)
{
	this.templateName = moveTemplateName;
	this.numArgs = moveTemplateNumArguments;
	this.result = moveTemplateResult;
	this.checkLegality = moveTemplateLegality;
};

function RPSplayer(playerName, playerCards)
{
	this.name = playerName;
	this.cards = playerCards;
};

function RPSinitPlayers(initPlayersName, initPlayersCardNames, initZonesPerLine)
{
	this.playerName = initPlayersName;
	this.cardNames = initPlayersCardNames;
};

function RPSinitZonesPerLine(numZonesPerLine)
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