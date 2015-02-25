var zones;
var cards;
var moveTemplates;
var moves;
var players;
var init;
var winCondition;

var ZONES_PER_LINE = 3;

function readJSON(file)
{
	var request = new XMLHttpRequest();
	request.open("GET", "http://users.wpi.edu/~mhperlman/isp/" + file + ".json", true);
	request.onload = function(response)
	{
		var read = JSON.parse(request.responseText);
		zones = read.zones;
		cards = read.cards;
		moveTemplates = read.moveTemplates;
		players = read.players;
		init = read.init;
		winCondition = read.winCondition;
		initialize();
	};
	request.send();
};

function parseJSON(string)
{
	var read = JSON.parse(string);
	zones = JSON.parse(read[0].zones);
	cards = JSON.parse(read[1].cards);
	moveTemplates = read[2].moveTemplates;
	moveTemplates.forEach(function(item)
	{
		var newCheckLegality = "(" + item.checkLegality + ")"
		item.checkLegality = newCheckLegality;
		var newResult = "(" + item.result + ")"
		item.result = newResult;
	})
	players = read[3].players;
	init = read[4].init;
	winCondition = "(" + read[5].winCondition + ")"

	initialize();
};

function printGameState()
{
	var output = "";
	for (var i = 0; i < zones.length; i++) {
		if (zones[i].cards.length == 0)
		{
			output += "_";
		}
		else
		{
			output += zones[i].cards[0].value;
		}  
		output += " ";
		
		if (i % ZONES_PER_LINE == ZONES_PER_LINE - 1)
		{
			output += "\n";
		}
	};
	console.log(output);
};

function lookupMoveTemplate(name)
{
	var success = false;
	var returnTemplate;
	for (var i = 0; i < moveTemplates.length; i++) {
		if (name == moveTemplates[i].templateName)
		{
			success = true;
			returnTemplate = moveTemplates[i];
		}
	};
	if (success)
	{
		return returnTemplate;
	}
	else
	{
		console.log("No template named \"" + name + "\" exists");
	}
}

function generateMovesFromCard(card)
{
	var moveList = [];
	for (var i = 0; i < card.moves.length; i++)
	{
		var moveTemp = lookupMoveTemplate(card.moves[i].templateName);

		var move = {"name": moveTemp.templateName, "card": card, "numArgs": moveTemp.numArgs, "arguments": card.moves[i].arguments, "result": moveTemp.result, "checkLegality": moveTemp.checkLegality};

		moveList.push(move);
	};

	return moveList;
}

function assignMove(move, player)
{

	var moveArgs = move.arguments;
	moveArgs.push(player);

	if (eval(move.checkLegality).apply(this, moveArgs))
	{
		eval(move.result).apply(this, moveArgs);
		printGameState();
		return true;
	}
	else
	{
		console.log("Illegal move");
		return false;
	}
};

function getLegalMoves(player)
{
	var legalMoves = [];
	for (var h = 0; h < player.cards.length; h++) {
		var currentMoves = generateMovesFromCard(player.cards[h]);
		for (var i = 0; i < currentMoves.length; i++) {
			if (eval(currentMoves[i].checkLegality).apply(this, currentMoves[i].arguments))
			{
				legalMoves.push(currentMoves[i]);
			}
		};
	}
	return legalMoves;
}

function pickLegalMove(player)
{
	var legalMoves = getLegalMoves(player);
	if (legalMoves.length == 0)
	{
		console.log("No legal moves");
		return;
	}
	return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};

function enemyMove()
{
	var enemyMove = pickLegalMove(players[1]);
	assignMove(enemyMove, players[1]);
};

//grid game specific helper function
function lookupZoneXY(x, y)
{
	for (var i = 0; i < zones.length; i++)
	{
		if (zones[i].locationX == x && zones[i].locationY == y)
		{
			return zones[i];
		}
	};
	return false;
}

//generalized
function lookupZone(parameterArray, valueArray)
{
	for (var i = 0; i < zones.length; i++) {
		var correctZone = true;
		for (var j = 0; j < parameterArray.length; j++) {
			if (zones[i][parameterArray[j]] != valueArray[j])
			{
				correctZone = false
			}
		};
		if (correctZone)
		{
			return zones[i];
		}
	};
	return false;
};

function ticTacToeMove(x, y)
{
	var zone = lookupZoneXY(x, y);
	if (!zone)
	{
		console.log("Invalid zone");
		return false;
	}

	var cardMoves = generateMovesFromCard(players[0].cards[0]);
	var moveToDo;

	//Select move on card that matches x and y given
	for (var i = 0; i < cardMoves.length; i++) {
		if (cardMoves[i].arguments[0] == x && cardMoves[i].arguments[1] == y)
		{
			moveToDo = cardMoves[i];
		}
	};

	return playerMove(moveToDo);
}

function rockPaperScissorsMove(hThrow)
{
	for (var i = 0; i < players[0].cards.length; i++)
	{
		if (players[0].cards[i].name == hThrow)
		{
			var card = players[0].cards[i];
			var cardMoves = generateMovesFromCard(card);
			var moveToDo = cardMoves[0];
			return playerMove(moveToDo);
		}
	};
	console.log("Invalid hand throw");
	return false;
}

function checkersMove(x, y, moveName)
{
	var zone = lookupZone(["x", "y"], [x, y]);
	if (!zone)
	{
		console.log("Invalid zone");
		return false;
	}

	var cardMoves = generateMovesFromCard(lookupCard(moveName));
	var moveToDo;

	//Select move on card that matches x and y given
	for (var i = 0; i < cardMoves.length; i++) {
		if (cardMoves[i].arguments[0] == x && cardMoves[i].arguments[1] == y)
		{
			moveToDo = cardMoves[i];
		}
	};
	return playerMove(moveToDo);
}

function playerMove(moveToDo)
{
	var wasLegal = assignMove(moveToDo, players[0]);
	if (checkWin())
	{
		return;
	}
	if (wasLegal)
	{
		enemyMove();
		if (checkWin())
		{
			return;
		}
	}
};

function initialize()
{
	for(var i = 0; i < init.length; i += 1)
	{
		if (init[i].playerName)
		{
			var currentPlayer = lookupPlayer(init[i].playerName);
			if(currentPlayer)
			{
				for(var j = 0; j < init[i].cardNames.length; j += 1)
				{
					var currentCard = lookupCard(init[i].cardNames[j]);
					if(currentCard)
					{
						var cardClone = objectClone(currentCard);
						cardClone.owner = currentPlayer;
						currentPlayer.cards.push(cardClone);
					}
				}
			}
		}
		else if (init[i].zoneName)
		{
			var currentZone = lookupZone(["name"],[init[i].zoneName]);
			if (currentZone)
			{
				for(var j = 0; j < init[i].cardNames.length; j += 1)
				{
					var currentCard = lookupCard(init[i].cardNames[j]);
					if(currentCard)
					{
						var cardClone = objectClone(currentCard);
						cardClone.owner = currentZone; //Is this correct? Need to double check //***
						currentZone.cards.push(cardClone);
					}
				}
			}
		}
		else if (init[i].zonesPerLine)
		{
			ZONES_PER_LINE = init[i].zonesPerLine;
		}
	}
};

function lookupCard(name)
{
	for(var i = 0; i < cards.length; i += 1)
	{
		if(cards[i].name == name)
		{
			return cards[i];
		}
	}
	console.log("Could not find card with name \"" + name + "\".");
	return false;
};

function lookupPlayer(name)
{
	for(var i = 0; i < players.length; i += 1)
	{
		if(players[i].name == name)
		{
			return players[i];
		}
	}
	console.log("Could not find player with name \"" + name + "\".");
	return false;
};

function checkWin()
{
	var result = eval(winCondition).apply(this);
	if (result)
	{
		console.log("Player " + result.name + " wins!");
		return true;
	}
	else
	{
		return false;
	}
};

function objectClone (oldObject) 
{
	return JSON.parse(JSON.stringify(oldObject));
};

function singleLineStringifyFunction (func)
{
	return (func + "").split("\n").join("").split("\t").join("");
};

readJSON("rps");