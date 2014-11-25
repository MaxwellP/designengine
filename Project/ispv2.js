var zones;
var cards;
var moveTemplates;
var players;
var init;
var winCondition;

var ZONES_PER_LINE = 3;

function readJSON(file)
{
	var request = new XMLHttpRequest();
	request.open("GET", "./" + file + ".json", true);
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
	for (var i = 0; i < card.moves.length; i++) {
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
	for (var i = 0; i < zones.length; i++) {
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

//Specific to tic-tac-toe (since we have no GUI)
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
	for (var i = 0; i < players[0].cards.length; i++) {
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

	//check win
	if (checkWin())
	{
		return;
	}

	if (wasLegal)
	{
		enemyMove();
		//check win
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

function removeCardFromPlayer (player, card)
{
	for (var i = 0; i < player.cards.length; i++) {
		if (player.cards[i] === card)
		{
			player.cards.splice(i, 1);
		}
	};
}

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

/*function checkWin()
{
	if (checkWinPlayer("X"))
	{
		console.log("Player won");
		return true;
	}
	else if (checkWinPlayer("O"))
	{
		console.log("Computer won");
		return true;
	}
	return false;
};

function checkWinPlayer(value)
{
	if (tttCheck3(0, 1, 2, value) || tttCheck3(3, 4, 5, value) || tttCheck3(6, 7, 8, value) || //horizontal
		tttCheck3(0, 3, 6, value) || tttCheck3(1, 4, 7, value) || tttCheck3(2, 5, 8, value) || //vertical
		tttCheck3(0, 4, 8, value) || tttCheck3(2, 4, 6, value))
	{
		return true;
	}
	return false;
};

//Specific to tic tac toe
function tttCheck3 (a, b, c, val)
{
	var stateA = state[a];
	var stateB = state[b];
	var stateC = state[c];
	if (stateA.value == val && stateB.value == val && stateC.value == val)
	{
		return true;
	}
	return false;
}*/

function objectClone (oldObject) 
{
	return JSON.parse(JSON.stringify(oldObject));
};

function singleLineStringifyFunction (func)
{
	return (func + "").split("\n").join("").split("\t").join("");
};

readJSON("rps");

//function () {var zone = lookupZone(["x", "y"], [arguments[0], arguments[1]]); var cardToMove = zone.cards[0]; var newZone = lookupZone(["x", "y"], [arguments[0] - 1, arguments[1] - 1]); newZone.cards.push(cardToMove); zone.cards.splice(0, 1);}