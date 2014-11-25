
function T5Ezone(zoneName, zoneCards)
{
	this.name = zoneName;
	this.cards = zoneCards;
};

function T5Emoves(movesTemplateName, movesArguments)
{
	this.templateName = movesTemplateName;
	this.arguments = movesArguments;
};

function T5Ecard(cardName, cardValue, cardMoves)
{
	this.name = cardName;
	this.value = cardValue;
	this.moves = cardMoves;
};

function T5EmoveTemplate(moveTemplateName, moveTemplateNumArguments, moveTemplateResult, moveTemplateLegality)
{
	this.templateName = moveTemplateName;
	this.numArgs = moveTemplateNumArguments;
	this.result = moveTemplateResult;
	this.checkLegality = moveTemplateLegality;
};

function T5Eplayer(playerName, playerCards)
{
	this.name = playerName;
	this.cards = playerCards;
};

function T5EinitPlayers(initPlayersName, initPlayersCardNames)
{
	this.playerName = initPlayersName;
	this.cardNames = initPlayersCardNames;
};

function T5EinitZonesPerLine(numZonesPerLine)
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