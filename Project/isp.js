var zones;
var cardTypes;
var moveTemplates;
var players;
var init;
var winCondition;
var functionFile;
var stateScore;

var cards = [];

var ZONES_PER_LINE = 3;

var USE_AI = false;

function GameState (zones, players)
{
	this.zones = zones;
	this.players = players;
}

var currentGS;

function readJSON(file)
{
	var request = new XMLHttpRequest();
	request.open("GET", "./" + file + ".json", true);
	request.onload = function(response)
	{
		var read = JSON.parse(request.responseText);
		zones = read.zones;
		cardTypes = read.cardTypes;
		moveTemplates = read.moveTemplates;
		players = read.players;
		init = read.init;
		winCondition = read.winCondition;
		functionFile = read.functionFile;
		stateScore = read.stateScore;
		initialize();
	};
	request.send();
};

function printGameState(gs)
{
	//return;
	var output = "";
	for (var i = 0; i < gs.zones.length; i++) {
		if (gs.zones[i].cards.length == 0)
		{
			output += "_";
		}
		else
		{
			output += gs.zones[i].cards[0].value;
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
		if (name == moveTemplates[i].name)
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

function generateMovesFromCard(card, gs)
{
	var moveList = [];
	for (var i = 0; i < card.moves.length; i++)
	{
		var moveTemp = lookupMoveTemplate(card.moves[i].templateName);
		var possibleArgs = []; //needs renaming
		if(moveTemp.argTypes.length == 0)
		{
			var move = {
				"name": moveTemp.name,
				"description": card.moves[i].description,
				"card": card, 
				"numArgs": moveTemp.numArgs,
				"arguments": [],
				"result": moveTemp.name + "Result",
				"checkLegality": moveTemp.name + "CheckLegality"
			};
			moveList.push(move);
		}
		for(var j = 0; j < moveTemp.argTypes.length; j += 1)
		{
			switch(moveTemp.argTypes[j])
			{
				case "zone":
					possibleArgs.push(gs.zones);
					break;
				case "player":
					console.log("The code for player selection doesn't exist yet.");
					break;
				case "card":
					console.log("The code for card selection doesn't exist yet.");
					break;
				case "given":
					var argToPush = [];
					argToPush[0] = card.moves[i].givenArgs[j];
					possibleArgs.push(argToPush);
					break;
				default:
					console.log("The argument type " + moveTemp.argTypes[j] + " is invalid.");
					break;
			}
		}
		for (var j = 0; j < possibleArgs.length; j++)
		{
			var possibleArgCombs = cartProd.apply(this, possibleArgs);
			for (var k = 0; k < possibleArgCombs.length; k++)
			{
				var move = {
					"name": moveTemp.name,
					"description": card.moves[i].description,
					"card": card, 
					"numArgs": moveTemp.numArgs,
					"arguments": possibleArgCombs[k],
					"result": moveTemp.name + "Result",
					"checkLegality": moveTemp.name + "CheckLegality"
				};
				moveList.push(move);
			}
		}
	}
	return moveList;
}

function generateMovesWithoutArgs(card, gs)
{
	var moveList = [];
	for (var i = 0; i < card.moves.length; i++)
	{
		var moveTemp = lookupMoveTemplate(card.moves[i].templateName);
		
		var move = {
			"name": moveTemp.name,
			"description": card.moves[i].description,
			"card": card, 
			"numArgs": moveTemp.numArgs,
			"arguments": [],
			"result": moveTemp.name + "Result",
			"checkLegality": moveTemp.name + "CheckLegality"
		};
		moveList.push(move);
	}

	return moveList;
}

function assignMove(move, player, gs)
{
	var moveArgs = move.arguments.slice();
	moveArgs.push(player);
	moveArgs.push(move);
	moveArgs.push(gs);

	if (window[move.checkLegality].apply(this, moveArgs))
	{
		window[move.result].apply(this, moveArgs);
		//printGameState(gs);
		return true;
	}
	else
	{
		console.log("Illegal move");
		return false;
	}
};

function getLegalMoves(player, gs)
{
	var legalMoves = [];
	var playerHand = lookupPlayerHand(player, gs);
	for (var h = 0; h < playerHand.cards.length; h++) {
		var currentMoves = generateMovesFromCard(playerHand.cards[h], gs);
		for (var i = 0; i < currentMoves.length; i++) {
			var move = currentMoves[i];
			var moveArgs = currentMoves[i].arguments.slice();
			moveArgs.push(player);
			moveArgs.push(move);
			moveArgs.push(gs);
			if (window[currentMoves[i].checkLegality].apply(this, moveArgs))
			{
				legalMoves.push(currentMoves[i]);
			}
		};
	}
	return legalMoves;
}

function getLegalMovesFromCard(card, gs)
{
	var legalMoves = [];
	var currentMoves = generateMovesFromCard(card, gs);
	for (var i = 0; i < currentMoves.length; i++) {
		var move = currentMoves[i];
		var moveArgs = currentMoves[i].arguments.slice();
		var player = getPlayerFromHand(card.owner, gs);
		moveArgs.push(player);
		moveArgs.push(move);
		moveArgs.push(gs);
		if (window[currentMoves[i].checkLegality].apply(this, moveArgs))
		{
			legalMoves.push(currentMoves[i]);
		}
	};
	return legalMoves;
}

//Pick random legal move
function pickLegalMove(player, gs)
{
	var legalMoves = getLegalMoves(player, gs);
	if (legalMoves.length == 0)
	{
		console.log("No legal moves");
		return;
	}
	return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};

function enemyMove(gs)
{
	if (!USE_AI)
	{
		var enemyMove = pickLegalMove(gs.players[1], gs);
		assignMove(enemyMove, gs.players[1], gs);
		return;
	}
	//var enemyMove = pickLegalMove(gs.players[1], gs);
	var enemyMove = tryAI(gs);
	if (!enemyMove)
	{
		console.log("Back up - do random move");
		enemyMove = pickLegalMove(gs.players[1], gs);
	}
	assignMove(enemyMove, gs.players[1], gs);
};

//generalized
function lookupZone(parameterArray, valueArray, gs)
{
	for (var i = 0; i < gs.zones.length; i++) {
		var correctZone = true;
		for (var j = 0; j < parameterArray.length; j++) {
			if (gs.zones[i][parameterArray[j]] != valueArray[j])
			{
				correctZone = false;
			}
		};
		if (correctZone)
		{
			return gs.zones[i];
		}
	};
	return false;
};

function lookupPlayerHand(player, gs)
{
	return lookupZone(["name"], [player.hand], gs);
}

function getPlayerFromHand(handName, gs)
{
	for (var i = 0; i < gs.players.length; i++) {
		if (lookupPlayerHand(gs.players[i], gs).name == handName)
		{
			return gs.players[i];
		}
	};
}

function zoneIsPlayerHand(zone, gs)
{
	for (var i = 0; i < gs.players.length; i++) {
		if (lookupPlayerHand(gs.players[i], gs) == zone)
		{
			return true;
		}
	};
	return false;
}

function cardIsInPlayerHand(card, player, gs)
{
	var playerHand = lookupPlayerHand(player, gs);
	for (var i = 0; i < playerHand.cards.length; i++) {
		if (playerHand.cards[i] == card)
		{
			return true;
		}
	};
	return false;
}

//Uses the Current Game State (currentGS)
//Specific to tic-tac-toe (since we have no GUI)
function ticTacToeMove(x, y)
{
	var zone = lookupZoneXY(x, y, currentGS);
	if (!zone)
	{
		console.log("Invalid zone");
		return false;
	}

	var cardMoves = generateMovesFromCard(currentGS.players[0].cards[0]);
	var moveToDo;

	//Select move on card that matches x and y given
	for (var i = 0; i < cardMoves.length; i++) {
		if (cardMoves[i].arguments[0] == x && cardMoves[i].arguments[1] == y)
		{
			moveToDo = cardMoves[i];
		}
	};

	return playerMove(moveToDo, currentGS);
}

//Uses the currentGameState (currentGS)
function rockPaperScissorsMove(hThrow)
{
	for (var i = 0; i < currentGS.players[0].cards.length; i++) {
		if (currentGS.players[0].cards[i].name == hThrow)
		{
			var card = currentGS.players[0].cards[i];
			var cardMoves = generateMovesFromCard(card);
			var moveToDo = cardMoves[0];
			return playerMove(moveToDo, currentGS);
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

function playerMove(moveToDo, gs)
{
	var wasLegal = assignMove(moveToDo, gs.players[0], gs);

	//check win
	if (checkWin(gs))
	{
		return;
	}

	if (wasLegal)
	{
		enemyMove(gs);
		//check win
		if (checkWin(gs))
		{
			return;
		}
	}
};

var cardIDCounter = 0;

function initCard (cardType)
{
	var card = lookupCard(cardType.name);
	var cardClone = objectClone(card);
	cardClone.id = cardIDCounter;
	cardIDCounter += 1;
	cards.push(cardClone);

	var guiCard = {"id": cardClone.id};
	cardsGUIInfo.push(guiCard);

	return cardClone;
}

function initialize()
{
	currentGS = new GameState(objectClone(zones), objectClone(players));
	cards = [];
	var imported = document.createElement("script");
	imported.src = functionFile;
	document.head.appendChild(imported);
	for(var i = 0; i < init.length; i += 1)
	{
		if (init[i].playerName)
		{
			var currentPlayer = lookupPlayer(init[i].playerName, currentGS);
			if(currentPlayer)
			{
				for(var j = 0; j < init[i].cardNames.length; j += 1)
				{
					var currentCard = lookupCard(init[i].cardNames[j]);
					if (currentCard)
					{
						var cardClone = initCard(currentCard);
						var playerHand = lookupPlayerHand(currentPlayer, currentGS);
						cardClone.owner = playerHand.name;
						playerHand.cards.push(cardClone);
					}
				}
			}
		}
		else if (init[i].zoneName)
		{
			var currentZone = lookupZone(["name"],[init[i].zoneName], currentGS);
			if (currentZone)
			{
				for(var j = 0; j < init[i].cardNames.length; j += 1)
				{
					var currentCard = lookupCard(init[i].cardNames[j]);
					if (currentCard)
					{
						var cardClone = initCard(currentCard);
						cardClone.owner = currentZone.name; //Is this correct? Need to double check //***
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

	initializeZoneGUI(zones);
};

function initializeZoneGUI(zoneList)
{
	for (var i = 0; i < zoneList.length; i++) {
		var zoneGUI = {"name": zoneList[i].name};
		zonesGUIInfo.push(zoneGUI);
	};
}

function lookupCard(name)
{
	for(var i = 0; i < cardTypes.length; i += 1)
	{
		if (cardTypes[i].name == name)
		{
			return cardTypes[i];
		}
	}
	console.log("Could not find cardType with name \"" + name + "\".");
	return false;
};

function lookupPlayer(name, gs)
{
	for(var i = 0; i < gs.players.length; i += 1)
	{
		if (gs.players[i].name == name)
		{
			return gs.players[i];
		}
	}
	console.log("Could not find player with name \"" + name + "\".");
	return false;
};

// DEPRECATED
function removeCardFromPlayer (player, card)
{
	for (var i = 0; i < player.cards.length; i++) {
		if (player.cards[i] === card)
		{
			player.cards.splice(i, 1);
		}
	};
}

// "newOwner" must be a zone
function moveCard (card, newOwner, gs)
{
	var prevOwner = lookupZone(["name"], [card.owner], gs);
	if (prevOwner)
	{
		for (var i = 0; i < prevOwner.cards.length; i++) {
			if (prevOwner.cards[i] === card)
			{
				prevOwner.cards.splice(i, 1);
			}
		};
	}
	newOwner.cards.push(card);
	card.owner = newOwner.name;
}

function checkWin(gs)
{
	var result = window[winCondition].apply(this, [gs]);
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

//readJSON("ttt");
readJSON("showoff");


//function () {var zone = lookupZone(["x", "y"], [arguments[0], arguments[1]]); var cardToMove = zone.cards[0]; var newZone = lookupZone(["x", "y"], [arguments[0] - 1, arguments[1] - 1]); newZone.cards.push(cardToMove); zone.cards.splice(0, 1);}

//Using a function found from:
//http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
//(Second answer, from ckozl)
function cartProd() {
	var args = [].slice.call(arguments);

	var end  = args.length - 1;
	var result = []
	function addTo(curr, start) {
		var first = args[start];
		var last = (start === end);
		for (var i = 0; i < first.length; ++i) {
			var copy = curr.slice();
			copy.push(first[i]);
			if (last)
			{
				result.push(copy);
			}
			else
			{
				addTo(copy, start + 1);
			}
		}
	}
	if (args.length)
	{
		addTo([], 0);
	}
	else
	{
		result.push([]);
	}
	return result;
}