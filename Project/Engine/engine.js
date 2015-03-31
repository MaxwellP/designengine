var gameDescription;
var currentGS;

var printLog = true;

var designing = false;

function readJSON(file)
{
	var request = new XMLHttpRequest();
	request.open("GET", "Games/" + file + ".json", true);
	request.onload = function(response)
	{
		var read = JSON.parse(request.responseText);
		var newGameDescription = new GameDescription(
			read.zones,
			read.universes,
			read.cardTypes,
			read.actionTemplates,
			read.playerTemplate,
			read.players,
			read.init,
			read.winCondition,
			read.functionFile,
			read.setupFunction,
			read.stateScore,
			read.phases);
		var gameState = newGameDescription.initializeGameState();
		initZoneGUI = read.zoneGUI;
		gameDescription = newGameDescription;
		currentGS = gameState;
		initialize(newGameDescription);
	};
	request.send();
}

function initialize(gd)
{
	//debugger;
	var imported = document.createElement("script");
	imported.src = "Games/" + gd.functionFile;
	document.head.appendChild(imported);
	
	imported.onload = function(response)
	{
		Init();
		gameLog("Initialized game state.");
		
		gameSetup(currentGS);

		gameLog("Begin " + currentGS.turnPlayer + "'s turn.");
		gameLog("Begin phase \"" + currentGS.currentPhase + "\".");
	}
}

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
		if(actionTemp.inputTypes.length === 0)
		{
			var action = new Action (
				actionTemp.name,
				actionTemp,
				card.id,
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
					card.id,
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
	var allLegalActions = getLegalActionsFromCard(card, lookupPlayer(currentGS.turnPlayer, gs), gs);

	var uniqueActionNames = [];

	var blankActions = [];

	for (var action of allLegalActions)
	{
		if (uniqueActionNames.indexOf(action.name) === -1)
		{
			uniqueActionNames.push(action.name);

			var actionTemp = lookupActionTemplate(action.template.name, gameDescription);

			var newAction = new Action (
				actionTemp.name,
				actionTemp,
				card.id,
				[],
				actionTemp.name + "CheckLegality",
				actionTemp.name + "Result");

			blankActions.push(newAction);
		}
	}

	return blankActions;
}

function applyAction (action, player, gs)
{
	var actionInputs = action.inputs.slice();
	actionInputs.push(player);
	actionInputs.push(action);
	actionInputs.push(gs);

	if (window[action.checkLegality].apply(this, actionInputs))
	{
		//console.log("Player " + player.name + " attempted to preform the action \"" + action.name + "\".");
		if (player.controlsZone(lookupCard(action.cardID, gs).zone))
		{
			gameLog("Player " + player.name + " performed the action \"" + action.name + "\".")
			window[action.result].apply(this, actionInputs);
			//printGameState(gs);
			//Check constantly checked things
			checkWin(gs, gameDescription);
			if (window[lookupPhase(gs.currentPhase, gameDescription).endCondition].apply(this, [gs]))
			{
				Event.Modify.endPhase(gs);
			}
			return true;
		}
		else
		{
			throw new Error("Player Doesn't Have Access Error");
			//console.log("Player does not have access to card.");
			//return false;
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
	for (var zone in playerObj.zones)
	{
		if (playerObj.zones.hasOwnProperty(zone))
		{
			var currentZone = lookupZone(playerObj.zones[zone], gs);
			for (var j = 0; j < currentZone.cards.length; j++)
			{
				var card = lookupCard(currentZone.cards[j], gs);
				legalActions = legalActions.concat(getLegalActionsFromCard(card, playerObj, gs));
			}
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
		gameLog("****	Player " + result.name + " wins!");
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


//load the game
readJSON("spaceships");