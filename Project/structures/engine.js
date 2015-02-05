var gameDescription;
var currentGS;

var printLog = true;

function readJSON(file)
{
	var request = new XMLHttpRequest();
	request.open("GET", "./" + file + ".json", true);
	request.onload = function(response)
	{
		var read = JSON.parse(request.responseText);
		var newGameDescription = new GameDescription(
			read.zones,
			read.cardTypes,
			read.actionTemplates,
			read.players,
			read.init,
			read.winCondition,
			read.functionFile,
			read.setupFunction,
			read.stateScore,
			read.phases);
		var gameState = newGameDescription.initializeGameState();
		gameDescription = newGameDescription;
		currentGS = gameState;
		initialize(newGameDescription);
		
	};
	request.send();


};


function initialize(gd)
{
	//debugger;
	var imported = document.createElement("script");
	imported.src = gd.functionFile;
	document.head.appendChild(imported);
	
	imported.onload = function(response)
	{
		Init();
		gameLog("Initialized game state.");
		
		gameSetup(currentGS);

		gameLog("Begin " + currentGS.turnPlayer + "'s turn.");
		gameLog("Begin phase \"" + currentGS.currentPhase + "\".");
	}
	
	//TODO: Change this for gui
	/*
	initializeZoneGUI(zones);
	updateTrees();
	zebra.ready();
	*/
};

function gameSetup (gs)
{
	gameLog("Running game setup function.");
	window[gameDescription.setupFunction].apply(this, [currentGS]);
}


function generateActionsFromCard (card, gs, gd)
{
	var actionList = [];
	for (var i = 0; i < card.actions.length; i++)
	{
		var actionTemp = lookupActionTemplate(card.actions[i].templateName, gd);
		var possibleInputs = [];
		if(actionTemp.inputTypes.length == 0)
		{
			var action = new Action (
				actionTemp.name,
				actionTemp,
				card,
				[],
				actionTemp.name + "CheckLegality",
				actionTemp.name + "Result");
			actionList.push(action);
		}
		//If the length is 0, this for loop is skipped
		for(var j = 0; j < actionTemp.inputTypes.length; j += 1)
		{
			switch(actionTemp.inputTypes[j])
			{
				case "zone":
					possibleInputs.push(getZoneNameArray(gs));
					break;
				case "player":
					possibleInputs.push(getPlayerNameArray(gs));
					break;
				case "card":
					possibleInputs.push(getCardIDArray(gs));
					break;
				case "given":
					/*var argToPush = [];
					argToPush[0] = card.actions[i].givenArgs[j];
					possibleInputs.push(argToPush);
					*/
					console.log("The code for this is not ready");
					break;
				default:
					console.log("The argument type " + actionTemp.inputTypes[j] + " is invalid.");
					break;
			}
		}
		for (var j = 0; j < possibleInputs.length; j++)
		{
			var possibleArgCombs = cartProd.apply(this, possibleInputs);
			for (var k = 0; k < possibleArgCombs.length; k++)
			{
				var action = new Action (
					actionTemp.name,
					actionTemp,
					card,
					possibleArgCombs[k],
					actionTemp.name + "CheckLegality",
					actionTemp.name + "Result");
				actionList.push(action);
			}
		}
	}
	return actionList;
}

function generateActionsWithoutInputs(card, gs)
{
	var actionList = [];
	for (var i = 0; i < card.actions.length; i++)
	{
		var actionTemp = lookupActionTemplate(card.actions[i].templateName, gameDescription);

		var action = new Action (
			actionTemp.name,
			actionTemp,
			card,
			[],
			actionTemp.name + "CheckLegality",
			actionTemp.name + "Result");
		
		actionList.push(action);
	}

	return actionList;
}

function applyAction (action, player, gs)
{
	var actionInputs = action.inputs.slice();
	actionInputs.push(player);
	actionInputs.push(action);
	actionInputs.push(gs);

	if (window[action.checkLegality].apply(this, actionInputs))
	{
		if (player.controlsZone(action.card.zone))
		{
			gameLog("Player " + player.name + " performed the action \"" + action.name + "\".")
			window[action.result].apply(this, actionInputs);
			//printGameState(gs);
			return true;
		}
		else
		{
			console.log("Player does not have access to card.")
			return false;
		}
	}
	else
	{
		console.log("Illegal action");
		return false;
	}
}

function getLegalActions (playerObj, gs) {
	var legalActions = [];
	for (var i = 0; i < playerObj.zones.length; i++)
	{
		var currentZone = lookupZone(playerObj.zones[i], gs);
		for (var j = 0; j < currentZone.cards.length; j++)
		{
			var card = lookupCard(currentZone.cards[j], gs);
			legalActions = legalActions.concat(getLegalActionsFromCard(card, playerObj, gs));
		}
	}
	return legalActions;
}

function getLegalActionsFromCard (card, player, gs) {
	var legalActions = [];
	var currentActions = generateActionsFromCard(card, gs, gameDescription);

	for (var k = 0; k < currentActions.length; k++)
	{
		var action = currentActions[k]
		var actionInputs = action.inputs.slice();
		actionInputs.push(player);
		actionInputs.push(action);
		actionInputs.push(gs);
		if (window[action.checkLegality].apply(this, actionInputs))
		{
			legalActions.push(action);
		}
	}
	return legalActions;
}

function checkWin(gs, gd)
{
	var result = window[gd.winCondition].apply(this, [gs]);
	if (result)
	{
		console.log("Player " + result.name + " wins!");
		return true;
	}
	else
	{
		return false;
	}
}

function isGameOver(gs, gd)
{
	//possibility for ties
	//     if (game is tied) return true
	return checkWin(gs, gd);
}

function gameLog (string) {
	if (printLog && !currentlySimulating)
	{
		console.log(string);
	}
}


//Start the AI Test game
readJSON("AIGame");