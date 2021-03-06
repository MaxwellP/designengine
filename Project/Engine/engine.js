var gameDescription;
var currentGS;

var printLog = true;

var designing = false;
var twoTabDesigning = false;

var loading = true;
var didFirstTimeGuiSetup = false;

var read;

function readJSON(file)
{
	loading = true;
	cardIDCounter = 0;
	playerIDCounter = 0;

	cardsGUIInfo = [];
	playersGUIInfo = [];
	zonesGUIInfo = [];


	var request = new XMLHttpRequest();
	request.open("GET", "Games/" + file + ".json", true);
	request.onload = function(response)
	{
		loadedJSON = request.responseText;
		read = JSON.parse(request.responseText);
		var newGameDescription = new GameDescription(
			read.zones,
			read.universes,
			read.cardTypes,
			read.actionTemplates,
			read.playerTemplate,
			read.players,
			read.init,
			read.gameName,
			read.functionFile,
			read.phases);
		var gameState = newGameDescription.initializeGameState();
		initializePercents(read.zoneGUI, read.playerGUI);
		gameDescription = newGameDescription;
		currentGS = gameState;
		initialize(newGameDescription);
		loading = false;

		InitGameGuiInfo();
		didFirstTimeGuiSetup = true;
	};
	request.send();
}

function initialize(gd)
{
	var imported = document.createElement("script");
	imported.src = "Games/" + gd.functionFile;
	document.head.appendChild(imported);
	
	imported.onload = function(response)
	{
		var jsRequest = new XMLHttpRequest();
		jsRequest.open("GET", "Games/" + gd.functionFile, true);
		jsRequest.onload = function(response) {
			loadedJS = jsRequest.responseText;
		}
		jsRequest.send();

		if (!didFirstTimeGuiSetup)
		{
			Init();
		}
		gameLog("Initialized game state.");
		
		gameStateInitialize(currentGS);

		gameLog("Begin " + currentGS.turnPlayer + "'s turn.");
		gameLog("Begin phase \"" + currentGS.currentPhase + "\".");
	}
}

function gameStateInitialize (gs)
{
	gameLog("Running game setup function.");
	window["gameSetup"].apply(this, [currentGS]);
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

//Merge with the above function????????????????

function generateActionsFromPlayer (player, gs, gd)
{
	var actionList = [];

	for (var pAction of player.actions)
	{
		var actionTemp = lookupActionTemplate(pAction.templateName, gd);
		var possibleInputs = [];
		if(actionTemp.inputTypes.length === 0)
		{
			var action = new Action (
				actionTemp.name,
				actionTemp,
				player.name, ////////////////////////////////////////////////////////////////////////////////////////////////////// <<<<---------error?
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
					player.name,
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

function generateActionsWithoutInputsPlayer(player, gs)
{
	if (player.name !== gs.turnPlayer)
	{
		return [];
	}
	var allLegalActions = getLegalActionsFromPlayer(player, gs);

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
				player.name,
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
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////// create a real system instead of looking at the typeof the action.cardID
		if (typeof(action.cardID) === "string" || player.controlsZone(lookupCard(action.cardID, gs).zone))
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
	legalActions = legalActions.concat(getLegalActionsFromPlayer(playerObj, gs));
	return legalActions;

}


function getLegalActionsFromPlayer (playerObj, gs) {
	var legalActions = [];
	var currentActions = generateActionsFromPlayer(playerObj, gs, gameDescription);

	for (var k = 0; k < currentActions.length; k++)
	{
		var action = currentActions[k]
		var actionInputs = action.inputs.slice();
		actionInputs.push(playerObj);
		actionInputs.push(action);
		actionInputs.push(gs);
		if (window[action.checkLegality].apply(this, actionInputs))
		{
			legalActions.push(action);
		}
	}
	return legalActions;
}

function getLegalActionsFromCard (card, playerObj, gs) {
	var legalActions = [];
	var currentActions = generateActionsFromCard(card, gs, gameDescription);

	for (var k = 0; k < currentActions.length; k++)
	{
		var action = currentActions[k]
		var actionInputs = action.inputs.slice();
		actionInputs.push(playerObj);
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
	var result = window["gameWinCondition"].apply(this, [gs]);
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

