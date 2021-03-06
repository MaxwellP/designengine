/*
DESIGN-TIME GUI
*/

var currentZone;
var currentCard;
var currentActionTemp;
var currentOther;
var currentPlayer;

var actionResultCode;
var actionCheckLegalityCode;
var otherCode;
var phaseInitCode;
var phaseEndCode;

var jsonCode;
var jsCode;

function initDesign() {
	canvas = document.getElementById("Canvas2D");
	ctx = canvas.getContext('2d');

	twoTabDesigning = true;

	//var menu = $("#menu");
	//menu.dialog("open");
	//document.getElementById("gameTitle").value = gameDescription.gameName;

	canvas.width = canvas.width * 0.7;

	jsonCode.setValue(loadedJSON);
	jsCode.setValue(loadedJS);

	document.getElementById("tabs").style.display = "inline-block";
}

function endDesign() {

	twoTabDesigning = false;
	//$(".editor").dialog("close");

	canvas.width = window.innerWidth - 20;

	jsonCode.setValue("");

	document.getElementById("tabs").style.display = "none";	

	//Restarting will happen on apply
	//restartGame();
}

function highlight() {
	if (currentCard !== undefined)
	{
		var cardGUI = lookupCardGUI(currentCard, currentGS);

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = CARD_OUTLINE_WEIGHT * 1.5;
		ctx.strokeStyle = "blue";
		ctx.rect(cardGUI.x - 5, cardGUI.y - 5, cardGUI.width + 10, cardGUI.height + 10);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
	if (currentZone !== undefined)
	{
		var zoneGUI = lookupZoneGUI(currentZone);
		
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = ZONE_OUTLINE_WEIGHT * 1.5;
		ctx.strokeStyle = "blue";
		ctx.rect(zoneGUI.x - (zoneGUI.width / 2) - 10, zoneGUI.y - (zoneGUI.height / 2) - 10, zoneGUI.width + 20, zoneGUI.height + 20);
		ctx.stroke();
		ctx.restore();
	}
	if (currentPlayer !== undefined)
	{
		var playerGUI = lookupPlayerGUI(currentPlayer);
		
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = CARD_OUTLINE_WEIGHT * 1.5;
		ctx.strokeStyle = "blue";
		ctx.rect(playerGUI.x - (playerGUI.width / 2) - 10, playerGUI.y - (playerGUI.height / 2) - 10, playerGUI.width + 20, playerGUI.height + 20);
		ctx.stroke();
		ctx.restore();
	}
}

function addNewZone() {
	var newZoneName = document.getElementById("newZoneName").value;

	var playerNames = [];
	for (var i = 0; i < gameDescription.players.length; i++) {
		playerNames.push(gameDescription.players[i].name);
	}

	var newZone = new Zone (newZoneName, {}, "showEachCard", playerNames);
	var newZoneGUI = new ZoneGUIInfo (newZone, 0.5, 0.5);

	currentGS.zones.push(newZone);
	gameDescription.zones.push(newZone);

	zonesGUIInfo.push(newZoneGUI);
}

function addNewPlayer() {
	console.log("Adding new Player");
}

function addNewCard() {
	var newCardName = document.getElementById("newCardName").value;

	var newCardType = {"name": newCardName, "attributes": {}, "actions": []};

	var newCard = initCard(newCardType, currentGS.zones[0]);
	var newCardGUI = new CardGUIInfo (newCard);
	cardsGUIInfo.push(newCardGUI);
	currentGS.cards.push(newCard);
	currentGS.zones[0].cards.push(newCard.id);
	

	gameDescription.cardTypes.push(newCardType);

}

function hideAllInfo() {
	clearZoneInfo();
	clearCardInfo();
}

function clearZoneInfo() {
	document.getElementById("zone_player_checkboxes").innerHTML = "";
	document.getElementById("zoneAttrSelect").innerHTML = "";
	document.getElementById("edit_zone_attributes").style.visibility = "hidden";
	document.getElementById("zoneAttrName").value = "";
	currentZone = undefined;
}

function clearCardInfo() {
	document.getElementById("cardAttrSelect").innerHTML = "";
	document.getElementById("edit_card_attributes").style.visibility = "hidden";
	document.getElementById("cardAttrName").value = "";
	document.getElementById("cardActionSelect").innerHTML = "";
	document.getElementById("templateSelect").innerHTML = "";
	currentCard = undefined;
}

function clearActionInfo() {
	document.getElementById("inputSelect").innerHTML = "";
}

function clearPlayerInfo() {
	document.getElementById("playerTagSelect").innerHTML = "";
	document.getElementById("playerZoneSelect").innerHTML = "";
	document.getElementById("playerZoneSelect").style.visibility = "hidden";
	document.getElementById("playerAttrSelect").innerHTML = "";
	document.getElementById("edit_player_attributes").style.visibility = "hidden";
}

function clearPlayerTemplateInfo() {
	document.getElementById("playerTempTagSelect").innerHTML = "";
	document.getElementById("playerTempAttrSelect").innerHTML = "";
	document.getElementById("playerActionSelect").innerHTML = "";
	document.getElementById("zoneTagName").value = "";
	document.getElementById("playerAttrName").value = "";
	document.getElementById("newPlayerActionName").value = "";
}

function clearPhaseInfo() {
	document.getElementById("phaseSelect").innerHTML = "";
}

function fillZoneInfo (zone, x, y) {
	clearZoneInfo();

	var editor = $("#zone_editor");
	editor.dialog({
		title: "Editing Zone: " + zone.name
	});
	editor.dialog("open");

	var zoneForm = document.getElementById("zone_form");

	for (var i = 0; i < zoneForm.zoneType.options.length; i++) {
		if (zoneForm.zoneType.options[i].value == zone.type)
		{
			zoneForm.zoneType.selectedIndex = i;
		}
	};

	for (var index in zone.attributes) {
		var newOption = document.createElement("OPTION");
		newOption.value = index;
		var text = document.createTextNode(index);

		var attrSelect = document.getElementById("zoneAttrSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	for (var i = 0; i < gameDescription.players.length; i++) {
		var newCheckbox = document.createElement("INPUT");
		newCheckbox.type = "checkbox";
		newCheckbox.name = gameDescription.players[i].name;
		var text = document.createTextNode(gameDescription.players[i].name);
		//newCheckbox.appendChild(text);

		for (var j = 0; j < zone.visibleTo.length; j++) {
			if (zone.visibleTo[j] == gameDescription.players[i].name)
			{
				newCheckbox.checked = true;
			}
		};

		var checkboxDiv = document.getElementById("zone_player_checkboxes");
		checkboxDiv.appendChild(newCheckbox);
		checkboxDiv.appendChild(text);
	};

	positionZoneInfo(x, y);
	currentZone = zone;
}

function positionZoneInfo (x, y) {
	var zoneInfo = $("#zone_editor");

	/*
	var zoneGUI = lookupZoneGUI(zone);
	var editWindowX = zoneGUI.x + (zoneGUI.width / 2);
	var editWindowY = zoneGUI.y + (zoneGUI.height / 2);
	*/

	var editWindowX = x + 9;
	var editWindowY = y + 9;

	//zoneInfo.style.position = "absolute";
	//zoneInfo.style.left = "" + editWindowX + "px";
	//zoneInfo.style.top = "" + editWindowY + "px";
	//zIndex?
}

function fillZoneAttributeInfo () {
	var attrSelect = document.getElementById("zoneAttrSelect");
	var attrValue = document.getElementById("zoneAttrValue");

	document.getElementById("edit_zone_attributes").style.visibility = "visible";

	attrValue.value = currentZone.attributes[attrSelect.value];
	
}

function addNewZoneAttribute() {
	var zone = currentZone;
	var attrName = document.getElementById("zoneAttrName");
	
	zone.attributes[attrName.value] = "";

	var newOption = document.createElement("OPTION");
	newOption.value = attrName.value;
	var text = document.createTextNode(attrName.value);

	var attrSelect = document.getElementById("zoneAttrSelect");
	newOption.appendChild(text);
	attrSelect.appendChild(newOption);
}

function removeZoneAttribute() {
	var zone = currentZone;
	var attrSelect = document.getElementById("zoneAttrSelect");

	delete zone.attributes[attrSelect.value];

	attrSelect.innerHTML = "";

	for (var index in zone.attributes) {
		var newOption = document.createElement("OPTION");
		newOption.value = index;
		var text = document.createTextNode(index);

		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	document.getElementById("edit_zone_attributes").style.visibility = "hidden";
}

function getAttrValue(value) {
	if (!!parseInt(value))
	{
		return parseInt(value);
	}
	else if (value === "true")
	{
		return true;
	}
	else if (value === "false")
	{
		return false;
	}
	else
	{
		return value;
	}
}

function applyZoneChanges() {
	var zoneForm = document.getElementById("zone_form");
	var zone = currentZone;
	var zoneGUI = lookupZoneGUI(zone);

	var attrSelect = document.getElementById("zoneAttrSelect");
	var attrValue = document.getElementById("zoneAttrValue").value;

	attrValue = getAttrValue(attrValue);
	
	if (attrSelect.value !== "")
	{
		zone.attributes[attrSelect.value] = attrValue;
	}

	zone.type = zoneForm.zoneType.value;

	var visibleArr = [];
	var playerBoxes = document.getElementById("zone_player_checkboxes");
	for (var i = 0; i < (playerBoxes.childNodes.length / 2); i++) {
		if (playerBoxes.childNodes[i * 2].checked)
		{
			visibleArr.push(playerBoxes.childNodes[i * 2].name);
		}
	};
	zone.visibleTo = visibleArr;

	var newZones = [];
	for (var i = 0; i < currentGS.zones.length; i++)
	{
		newZones.push(currentGS.zones[i].clone());
	}

	gameDescription.zones = newZones;

	return false;
}

function fillCardInfo (card, x, y) {
	clearCardInfo();

	var editor = $("#card_editor");
	editor.dialog({
		title: "Editing Card: " + card.name
	});
	editor.dialog("open");

	var cardForm = document.getElementById("card_form");

	for (var index in card.attributes) {
		var newOption = document.createElement("OPTION");
		newOption.value = index;
		var text = document.createTextNode(index);

		var attrSelect = document.getElementById("cardAttrSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	for (var actionObj of card.actions) {
		var newOption = document.createElement("OPTION");
		newOption.value = actionObj.templateName;
		var text = document.createTextNode(actionObj.templateName);

		var actionSelect = document.getElementById("cardActionSelect");
		newOption.appendChild(text);
		actionSelect.appendChild(newOption);
	}

	for (var actionTemp of gameDescription.actionTemplates) {
		var newOption = document.createElement("OPTION");
		newOption.value = actionTemp.name;
		var text = document.createTextNode(actionTemp.name);

		var actionDropDown = document.getElementById("templateSelect");
		newOption.appendChild(text);
		actionDropDown.appendChild(newOption);
	}

	positionCardInfo(x, y);
	currentCard = card;
}

function positionCardInfo (x, y) {
	//var cardInfo = document.getElementById("card_info");

	var editWindowX = x + 9;
	var editWindowY = y + 9;

	//cardInfo.style.position = "absolute";
	//cardInfo.style.left = "" + editWindowX + "px";
	//cardInfo.style.top = "" + editWindowY + "px";
}

function fillCardAttributeInfo () {
	var attrSelect = document.getElementById("cardAttrSelect");
	var attrValue = document.getElementById("cardAttrValue");

	document.getElementById("edit_card_attributes").style.visibility = "visible";

	attrValue.value = currentCard.attributes[attrSelect.value];
	
}

function addNewCardAttribute() {
	var card = currentCard;
	var attrName = document.getElementById("cardAttrName");
	
	card.attributes[attrName.value] = "";

	var newOption = document.createElement("OPTION");
	newOption.value = attrName.value;
	var text = document.createTextNode(attrName.value);

	var attrSelect = document.getElementById("cardAttrSelect");
	newOption.appendChild(text);
	attrSelect.appendChild(newOption);
}

function removeCardAttribute() {
	var card = currentCard;
	var attrSelect = document.getElementById("cardAttrSelect");

	delete card.attributes[attrSelect.value];

	attrSelect.innerHTML = "";

	for (var index in card.attributes) {
		var newOption = document.createElement("OPTION");
		newOption.value = index;
		var text = document.createTextNode(index);

		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	document.getElementById("edit_card_attributes").style.visibility = "hidden";
}

function addExistingActionTemplate() {
	var card = currentCard;

	var actionSel = document.getElementById("cardActionSelect");
	var actionDrop = document.getElementById("templateSelect");

	var newActionObj = {};
	newActionObj.templateName = actionDrop.value;

	card.actions.push(newActionObj);

	var newOption = document.createElement("OPTION");
	newOption.value = actionDrop.value;
	var text = document.createTextNode(actionDrop.value);

	newOption.appendChild(text);
	actionSel.appendChild(newOption);
}

function removeAction() {
	var card = currentCard;

	var actionSel = document.getElementById("cardActionSelect");

	card.actions.splice(actionSel.selectedIndex, 1);

	actionSel.removeChild(actionSel.childNodes[actionSel.selectedIndex]);
}

function addNewAction() {
	var newActionText = document.getElementById("newActionName");

	var newActionTemp = {
		"name": newActionText.value,
		"description": "",
		"result": newActionText.value + "Result",
		"checkLegality": newActionText.value + "CheckLegailty",
		"inputTypes": []
	};

	gameDescription.actionTemplates.push(newActionTemp);

	var actionSel = document.getElementById("cardActionSelect");
	var newOption = document.createElement("OPTION");
	newOption.value = newActionText.value;
	var text = document.createTextNode(newActionText.value);

	newOption.appendChild(text);
	actionSel.appendChild(newOption);

}

function applyCardChanges() {
	var cardForm = document.getElementById("card_form");
	var card = currentCard;
	var cardGUI = lookupCardGUI(card);

	var attrSelect = document.getElementById("cardAttrSelect");
	var attrValue = document.getElementById("cardAttrValue").value;

	attrValue = getAttrValue(attrValue);
	
	if (attrSelect.value !== "")
	{
		card.attributes[attrSelect.value] = attrValue;
	}

	var cardType = lookupCardType(card.name, gameDescription);
	cardType.attributes = objectClone(card.attributes);
	cardType.actions = card.actions;

	return false;
}

function editAction() {
	fillActionInfo(document.getElementById("cardActionSelect").value);
}

function fillActionInfo(actionName) {
	clearActionInfo();

	var editor = $("#action_editor");
	editor.dialog({
		title: "Editing Action: " + actionName
	});
	editor.dialog("open");

	var actionTemplate = lookupActionTemplate(actionName, gameDescription);
	currentActionTemp = actionTemplate;

	document.getElementById("actionDesc").value = actionTemplate.description;

	for (var input of actionTemplate.inputTypes) {
		var newOption = document.createElement("OPTION");
		newOption.value = input;
		var text = document.createTextNode(input);

		var inputSelect = document.getElementById("inputSelect");
		newOption.appendChild(text);
		inputSelect.appendChild(newOption);
	}

	var resultString = "" + window[actionTemplate.result];
	if (resultString === "undefined")
	{
		resultString = "function " + actionName + "Result() {\n\tvar player = arguments[arguments.length - 3].name;\n\tvar action = arguments[arguments.length - 2];\n\tvar gamestate = arguments[arguments.length - 1];\n}";
	}
	actionResultCode.setValue(resultString);

	var checkLegalityString = "" + window[actionTemplate.checkLegality];
	if (checkLegalityString === "undefined")
	{
		checkLegalityString = "function " + actionName + "CheckLegailty() {\n\tvar player = arguments[arguments.length - 3].name;\n\tvar action = arguments[arguments.length - 2];\n\tvar gamestate = arguments[arguments.length - 1];\n\n\treturn true;\n}";
	}
	actionCheckLegalityCode.setValue(checkLegalityString);
}

function addInput() {
	var actionTemp = currentActionTemp;
	var inputDrop = document.getElementById("inputTypes");
	
	actionTemp.inputTypes.push(inputDrop.value);

	var newOption = document.createElement("OPTION");
	newOption.value = inputDrop.value;
	var text = document.createTextNode(inputDrop.value);

	var inputSelect = document.getElementById("inputSelect");
	newOption.appendChild(text);
	inputSelect.appendChild(newOption);
}

function removeInput() {
	var actionTemp = currentActionTemp;

	var inputSelect = document.getElementById("inputSelect");

	actionTemp.inputTypes.splice(inputSelect.selectedIndex, 1);

	inputSelect.removeChild(inputSelect.childNodes[inputSelect.selectedIndex]);
}

function applyActionChanges() {
	currentActionTemp.description = document.getElementById("actionDesc").value;

	//var newResult = new Function(actionResultCode.getValue());
	//Uggh I don't like this, but using "new Function" wraps it in an anonymous function, which makes the window unable to access it
	var newResult = eval("(" + actionResultCode.getValue() + ")");
	window[currentActionTemp.result] = newResult;

	//var newCheckLegality = new Function(actionCheckLegalityCode.getValue());
	var newCheckLegality = eval("(" + actionCheckLegalityCode.getValue() + ")");
	window[currentActionTemp.checkLegality] = newCheckLegality;
}

function editOther(mode) {
	currentOther = mode;
	var editor = $("#other_editor");
	editor.dialog({
		title: "Editing " + mode
	});
	editor.dialog("open");

	var codeString;
	if (mode === "Setup Function")
	{
		codeString = "" + window["gameSetup"];
	}
	else if (mode === "Win Condition")
	{
		codeString = "" + window["gameWinCondition"];
	}
	else if (mode === "State Score")
	{
		codeString = "" + window["gameStateScore"];
	}

	otherCode.setValue(codeString);
}

function applyOtherChanges() {
	var newCode;
	newCode = eval("(" + otherCode.getValue() + ")");
	if (currentOther === "Setup Function")
	{
		window["gameSetup"] = newCode;
	}
	else if (currentOther === "Win Condition")
	{
		window["gameWinCondition"] = newCode;
	}
	else if (currentOther === "State Score")
	{
		window["gameStateScore"] = newCode;
	}
}

function fillPlayerInfo (player, x, y) {
	clearPlayerInfo();

	var playerTemp = gameDescription.playerTemplate;

	var editor = $("#player_editor");
	editor.dialog({
		title: "Editing Player: " + player.name
	});
	editor.dialog("open");

	var playerForm = document.getElementById("player_form");

	for (var i = 0; i < playerTemp.zoneTags.length; i++) {
		var newOption = document.createElement("OPTION");
		newOption.value = playerTemp.zoneTags[i];
		var text = document.createTextNode(playerTemp.zoneTags[i]);

		var attrSelect = document.getElementById("playerTagSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	for (var i = 0; i < playerTemp.attributeNames.length; i++) {
		var newOption = document.createElement("OPTION");
		newOption.value = playerTemp.attributeNames[i];
		var text = document.createTextNode(playerTemp.attributeNames[i]);

		var attrSelect = document.getElementById("playerAttrSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	currentPlayer = player;
}

function fillPlayerTagInfo () {
	var zoneDropdown = document.getElementById("playerZoneSelect");
	var tagSelect = document.getElementById("playerTagSelect");

	zoneDropdown.innerHTML = "";
	zoneDropdown.style.visibility = "visible";

	var selectID = 0;

	for (var i = 0; i < currentGS.zones.length; i++) {
		if (currentGS.zones[i].name === currentPlayer.zones[tagSelect.value])
		{
			selectID = i;
		}

		var newOption = document.createElement("OPTION");
		newOption.value = currentGS.zones[i].name;
		var text = document.createTextNode(currentGS.zones[i].name);

		var attrSelect = document.getElementById("playerZoneSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	};

	zoneDropdown.selectedIndex = selectID;
}

function fillPlayerAttributeInfo () {
	var attrSelect = document.getElementById("playerAttrSelect");
	var attrValue = document.getElementById("playerAttrValue");

	document.getElementById("edit_player_attributes").style.visibility = "visible";

	attrValue.value = currentPlayer.attributes[attrSelect.value];
}

function applyPlayerChanges () {
	var selectedZoneIndex = document.getElementById("playerTagSelect").value;
	var dropdownZone = document.getElementById("playerZoneSelect").value;
	currentPlayer.zones[selectedZoneIndex] = dropdownZone;

	var selectedAttribute = document.getElementById("playerAttrSelect").value;
	var newValue = document.getElementById("playerAttrValue").value;

	newValue = getAttrValue(newValue);

	currentPlayer.attributes[selectedAttribute] = newValue;

	for (var i = 0; i < gameDescription.players.length; i++) {
		if (gameDescription.players[i].name === currentPlayer.name)
		{
			gameDescription.players[i] = currentPlayer.clone();
		}
	};

	return false;
}

function editPlayerTemplate () {
	$("#playertemp_editor").dialog("open");

	fillPlayerTemplateInfo();
}

function fillPlayerTemplateInfo() {
	clearPlayerTemplateInfo();

	var pTemp = gameDescription.playerTemplate;

	for (var i = 0; i < pTemp.zoneTags.length; i++) {
		var newOption = document.createElement("OPTION");
		newOption.value = pTemp.zoneTags[i];
		var text = document.createTextNode(pTemp.zoneTags[i]);

		var attrSelect = document.getElementById("playerTempTagSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	for (var i = 0; i < pTemp.attributeNames.length; i++) {
		var newOption = document.createElement("OPTION");
		newOption.value = pTemp.attributeNames[i];
		var text = document.createTextNode(pTemp.attributeNames[i]);

		var attrSelect = document.getElementById("playerTempAttrSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

	for (var actionObj of pTemp.actions) {
		var newOption = document.createElement("OPTION");
		newOption.value = actionObj.templateName;
		var text = document.createTextNode(actionObj.templateName);

		var actionSelect = document.getElementById("playerActionSelect");
		newOption.appendChild(text);
		actionSelect.appendChild(newOption);
	}

	for (var actionTemp of gameDescription.actionTemplates) {
		var newOption = document.createElement("OPTION");
		newOption.value = actionTemp.name;
		var text = document.createTextNode(actionTemp.name);

		var actionDropDown = document.getElementById("templatePlayerSelect");
		newOption.appendChild(text);
		actionDropDown.appendChild(newOption);
	}
}

function editPlayerAction() {
	fillActionInfo(document.getElementById("playerActionSelect").value);
}

function addNewPlayerAction() {
	var newActionText = document.getElementById("newPlayerActionName");

	var newActionTemp = {
		"name": newActionText.value,
		"description": "",
		"result": newActionText.value + "Result",
		"checkLegality": newActionText.value + "CheckLegality",
		"inputTypes": []
	};

	gameDescription.actionTemplates.push(newActionTemp);

	var actionSel = document.getElementById("playerActionSelect");
	var newOption = document.createElement("OPTION");
	newOption.value = newActionText.value;
	var text = document.createTextNode(newActionText.value);

	newOption.appendChild(text);
	actionSel.appendChild(newOption);

}

function removePlayerAction() {
	var pTemp = gameDescription.playerTemplate;

	var actionSel = document.getElementById("playerActionSelect");

	pTemp.actions.splice(actionSel.selectedIndex, 1);

	actionSel.removeChild(actionSel.childNodes[actionSel.selectedIndex]);
}

function addPlayerExistingActionTemplate() {
	var pTemp = gameDescription.playerTemplate;

	var actionSel = document.getElementById("playerActionSelect");
	var actionDrop = document.getElementById("templatePlayerSelect");

	var newActionObj = {};
	newActionObj.templateName = actionDrop.value;

	pTemp.actions.push(newActionObj);

	var newOption = document.createElement("OPTION");
	newOption.value = actionDrop.value;
	var text = document.createTextNode(actionDrop.value);

	newOption.appendChild(text);
	actionSel.appendChild(newOption);
}

function addNewAttrName() {
	var pTemp = gameDescription.playerTemplate;

	var attributeSel = document.getElementById("playerTempAttrSelect");
	var newAttrName = document.getElementById("playerAttrName");

	pTemp.attributeNames.push(newAttrName.value);

	var newOption = document.createElement("OPTION");
	newOption.value = newAttrName.value;
	var text = document.createTextNode(newAttrName.value);

	newOption.appendChild(text);
	attributeSel.appendChild(newOption);

	for (var i = 0; i < currentGS.players.length; i++) {
		currentGS.players[i].attributes[newAttrName.value] = undefined
	};
}

function removeAttrName() {
	var pTemp = gameDescription.playerTemplate;

	var attributeSel = document.getElementById("playerTempAttrSelect");

	pTemp.attributeNames.splice(attributeSel.selectedIndex, 1);

	for (var i = 0; i < currentGS.players.length; i++) {
		delete currentGS.players[i].attributes[attributeSel.value];
	};

	attributeSel.removeChild(attributeSel.childNodes[attributeSel.selectedIndex]);
}

function addNewZoneTag() {
	var pTemp = gameDescription.playerTemplate;

	var tagSel = document.getElementById("playerTempTagSelect");
	var newTagName = document.getElementById("zoneTagName");

	pTemp.zoneTags.push(newTagName.value);

	var newOption = document.createElement("OPTION");
	newOption.value = newTagName.value;
	var text = document.createTextNode(newTagName.value);

	newOption.appendChild(text);
	tagSel.appendChild(newOption);

	for (var i = 0; i < currentGS.players.length; i++) {
		currentGS.players[i].zones[newTagName.value] = currentGS.zones[0].name;
	};
}

function removeZoneTag() {
	var pTemp = gameDescription.playerTemplate;

	var tagSel = document.getElementById("playerTempTagSelect");

	pTemp.zoneTags.splice(tagSel.selectedIndex, 1);

	for (var i = 0; i < currentGS.players.length; i++) {
		delete currentGS.players[i].zones[tagSel.value];
	};

	tagSel.removeChild(tagSel.childNodes[tagSel.selectedIndex]);
}

function applyPlayerTemplateChanges() {
	//At the moment, does nothing, all changes happen immediately
}

function editPhases() {
	$("#phase_editor").dialog("open");

	fillPhaseInfo();
}

function fillPhaseInfo() {
	clearPhaseInfo();

	for (var i = 0; i < gameDescription.phases.length; i++) {
		var newOption = document.createElement("OPTION");
		newOption.value = gameDescription.phases[i].name;
		var text = document.createTextNode(gameDescription.phases[i].name);

		var attrSelect = document.getElementById("phaseSelect");
		newOption.appendChild(text);
		attrSelect.appendChild(newOption);
	}

}

function removePhase() {
	var phaseSel = document.getElementById("phaseSelect");

	gameDescription.phases.splice(phaseSel.selectedIndex, 1);

	phaseSel.removeChild(phaseSel.childNodes[phaseSel.selectedIndex]);
}

function addNewPhase() {
	var newPhaseName = document.getElementById("newPhaseName").value;

	var newPhase = new Phase(newPhaseName, newPhaseName + "Init", newPhaseName + "End");

	gameDescription.phases.push(newPhase);

	var phaseSel = document.getElementById("phaseSelect");
	var newOption = document.createElement("OPTION");
	newOption.value = newPhaseName;
	var text = document.createTextNode(newPhaseName);

	newOption.appendChild(text);
	phaseSel.appendChild(newOption);
}

function editPhase() {
	$("#phase_code_editor").dialog("open");

	fillPhaseCodeInfo(document.getElementById("phaseSelect").value);
}

function fillPhaseCodeInfo(phaseName) {
	var phase = lookupPhase(phaseName, gameDescription);
	var initString = "" + window[phase.init];
	if (initString === "undefined")
	{
		initString = "function " + [phaseName] + "Init() {\n\tvar gamestate = arguments[arguments.length - 1];\n}";
	}
	phaseInitCode.setValue(initString);

	var endString = "" + window[phase.endCondition];
	if (endString === "undefined")
	{
		endString = "function " + phaseName + "End() {\n\tvar gamestate = arguments[arguments.length - 1];\n\n\treturn false;\n}";
	}
	phaseEndCode.setValue(endString);
}

function applyPhaseCodeChanges() {
	var phase = lookupPhase(document.getElementById("phaseSelect").value, gameDescription);

	//var newResult = new Function(actionResultCode.getValue());
	//Uggh I don't like this, but using "new Function" wraps it in an anonymous function, which makes the window unable to access it
	var newInit = eval("(" + phaseInitCode.getValue() + ")");
	window[phase.init] = newInit;

	//var newCheckLegality = new Function(actionCheckLegalityCode.getValue());
	var newEnd = eval("(" + phaseEndCode.getValue() + ")");
	window[phase.endCondition] = newEnd;
}

function saveGame(gameName) {
	gameName = document.getElementById("gameTitle").value;
	if (gameName === undefined)
	{
		gameName = gameDescription.gameName;
	}
	SaveJSON(gameName);
	SaveJavaScript(gameName);
}

function exportJSON(newGameName) {
	var jsonRoot = {};
	jsonRoot.zones = [];
	for (var i = 0; i < currentGS.zones.length; i++)
	{
		var curZone = currentGS.zones[i];
		var tempZone = {};
		tempZone.name = curZone.name;
		//fix this attribute thing!
		tempZone.attributes = curZone.attributes;
		tempZone.type = curZone.type;
		tempZone.visibleTo = curZone.visibleTo;

		jsonRoot.zones.push(tempZone);
	}

	jsonRoot.zoneGUI = [];
	for (var i = 0; i < zonesGUIInfo.length; i++)
	{
		var curGUIInfo = zonesGUIInfo[i];
		var tempGUI = {};
		tempGUI.name = curGUIInfo.name;
		tempGUI.xPct = curGUIInfo.xPct;
		tempGUI.yPct = curGUIInfo.yPct;

		jsonRoot.zoneGUI.push(tempGUI);
	}

	jsonRoot.playerGUI = [];
	for (var i = 0; i < playersGUIInfo.length; i++)
	{
		var curGUIInfo = playersGUIInfo[i];
		var tempGUI = {};
		tempGUI.name = curGUIInfo.name;
		tempGUI.xPct = curGUIInfo.xPct;
		tempGUI.yPct = curGUIInfo.yPct;

		jsonRoot.playerGUI.push(tempGUI);
	}

	jsonRoot.universes = gameDescription.universes;

	jsonRoot.cardTypes = gameDescription.cardTypes;

	jsonRoot.actionTemplates = gameDescription.actionTemplates;

	jsonRoot.playerTemplate = gameDescription.playerTemplate;

	jsonRoot.players = [];
	for (var player of currentGS.players)
	{
		var pZones = [];
		for (var zone in player.zones)
		{
			//?? Correct order?
			pZones.push(player.zones[zone]);
		}

		var pAttrs = [];
		for (var attr in player.attributes)
		{
			//?? Does this work in the correct order?
			pAttrs.push(player.attributes[attr]);
		}

		var jsonPlayer = {
			name: player.name,
			zones: pZones,
			attributes: pAttrs,
			isAI: player.isAI
		};
		jsonRoot.players.push(jsonPlayer);
	}

	jsonRoot.init = gameDescription.init;

	jsonRoot.functionFile = newGameName + ".js";//gameDescription.functionFile;

	jsonRoot.gameName = newGameName;

	jsonRoot.phases = gameDescription.phases;
	
	//console.log(JSON.stringify(jsonRoot));
	return JSON.stringify(jsonRoot, null, "\t");
}

function exportJavaScript (newGameName) {
	var gName = newGameName;//gameDescription.gameName;
	var jsFile = "//" + gName + "\n\n";

	//-Setup
	var setupFunc = window["gameSetup"];
	jsFile += setupFunc + "\n\n";

	//Actions:
	// -Result
	// -CheckLegality
	for (var aTemplate of gameDescription.actionTemplates)
	{
		var checkLegal = window[aTemplate.checkLegality]
		var result = window[aTemplate.result];
		jsFile += result + "\n\n" + checkLegal + "\n\n";
	}

	//-Win Condition
	var winCond = window["gameWinCondition"];
	jsFile += winCond + "\n\n";

	//-State Score
	var stateScore = window["gameStateScore"];
	jsFile += stateScore + "\n\n";

	//Phases:
	//-Init
	//-End
	for (var phase of gameDescription.phases)
	{
		var phaseInit = window[phase.init];
		var phaseEndCond = window[phase.endCondition];
		jsFile += phaseInit + "\n\n" + phaseEndCond + "\n\n";
	}

	//console.log(jsFile);
	return jsFile;
}

//Modified version of this code:
//http://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file/19818659#19818659

function FileSave (data, filename, filetype) {

	if(!data) {
		console.error('FileSave: No data')
		return;
	}

	if(!filename) filename = 'unNamedFile.txt'

	if(typeof data === "object"){
		data = JSON.stringify(data, undefined, 4)
	}

	var blob = new Blob([data], {type: filetype || 'text/json'}),
		e    = document.createEvent('MouseEvents'),
		a    = document.createElement('a')

	a.download = filename
	a.href = window.URL.createObjectURL(blob)
	a.dataset.downloadurl =  [filetype || 'text/json', a.download, a.href].join(':')
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	a.dispatchEvent(e)
}

function SaveJavaScript (newGameName) {
	FileSave(exportJavaScript(newGameName), newGameName + ".js", "text/javascript");
}

function SaveJSON (newGameName) {
	FileSave(exportJSON(newGameName), newGameName + ".json", "text/json");
}

function FileLoad () {


}

var jsIsLoaded = false;
var jsonIsLoaded = false;
var loadedJS = undefined;
var loadedJSON = undefined;

//Based on code from:
//http://www.html5rocks.com/en/tutorials/file/dndfiles/
function handleFileSelect (event) {
	var files = event.target.files;

	if (files.length !== 2)
	{
		console.log("Provide exactly 1 .js file and 1 .json file!");
		return;
	}
	var haveJS = false;
	var haveJSON = false;
	var jsFile = undefined;
	var jsonFile = undefined;
	
	for (var i = 0, f; f = files[i]; i++)
	{
		var fileExt = f.name.split(".").pop();
		if (fileExt === "js")
		{
			haveJS = true;
			jsFile = f;
		}
		if (fileExt === "json")
		{
			haveJSON = true;
			jsonFile = f;
		}
	}
	if (!haveJS || !haveJSON)
	{
		console.log("Provide exactly 1 .js file and 1 .json file!");
		return;
	}

	var jsFileReader = new FileReader();
	var jsonFileReader = new FileReader();

	jsFileReader.onload = function (e) {
		console.log("js file loaded!");
		loadedJS = e.target.result;
		jsIsLoaded = true;

		if (jsIsLoaded && jsonIsLoaded)
		{
			bothFilesLoaded();
		}
	}
	jsonFileReader.onload = function (e) {
		console.log("json file loaded!");
		loadedJSON = e.target.result;
		jsonIsLoaded = true;

		if (jsIsLoaded && jsonIsLoaded)
		{
			bothFilesLoaded();
		}
	}

	jsFileReader.readAsText(jsFile);
	jsonFileReader.readAsText(jsonFile);

}

function bothFilesLoaded () {
	jsonIsLoaded = false;
	jsIsLoaded = false;

	cardIDCounter = 0;
	playerIDCounter = 0;

	cardsGUIInfo = [];
	playersGUIInfo = [];
	zonesGUIInfo = [];


	var read = JSON.parse(loadedJSON);
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
	initializeWithFile(newGameDescription, loadedJS);

	InitGameGuiInfo();
	didFirstTimeGuiSetup = true;


}

function initializeWithFile(gd, jsFile)
{
	var loadedScript = document.createElement("script");
	loadedScript.innerHTML = jsFile;
	document.head.appendChild(loadedScript);

	if (!didFirstTimeGuiSetup)
	{
		Init();
	}
	gameLog("Initialized game state.");
	
	gameStateInitialize(currentGS);

	gameLog("Begin " + currentGS.turnPlayer + "'s turn.");
	gameLog("Begin phase \"" + currentGS.currentPhase + "\".");
}

function restartGame () {


	cardIDCounter = 0;
	playerIDCounter = 0;

	cardsGUIInfo = [];
	playersGUIInfo = [];
	zonesGUIInfo = [];


	currentGS = gameDescription.initializeGameState();
	
	gameLog("Initialized game state.");
	
	gameStateInitialize(currentGS);

	gameLog("Begin " + currentGS.turnPlayer + "'s turn.");
	gameLog("Begin phase \"" + currentGS.currentPhase + "\".");

	InitGameGuiInfo();
}

function applyCodeChanges() {
	//console.log(loadedJSON);
	loadedJSON = jsonCode.getValue();
	loadedJS = jsCode.getValue();
	bothFilesLoaded()
}