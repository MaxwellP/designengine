/*
DESIGN-TIME GUI
*/

var currentZone;
var currentCard;
var currentActionTemp;
var currentOther;

var actionResultCode;
var actionCheckLegalityCode;
var otherCode;

function initDesign() {
	canvas = document.getElementById("Canvas2D");
	ctx = canvas.getContext('2d');

	designing = true;

	var menu = $("#menu");
	menu.dialog("open");
}

function endDesign() {

	designing = false;
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
		ctx.lineWidth = ZONE_OUTLINE_WEIGHT;
		ctx.strokeStyle = "blue";
		ctx.rect(zoneGUI.x - (zoneGUI.width / 2) - 10, zoneGUI.y - (zoneGUI.height / 2) - 10, zoneGUI.width + 20, zoneGUI.height + 20);
		ctx.stroke();
		ctx.restore();


		//drawZoneBox(zoneGUI.x, zoneGUI.y, zoneGUI.width, zoneGUI.height, zone.name);
	}
}

function addNewZone() {
	console.log("Adding new Zone");
}

function addNewPlayer() {
	console.log("Adding new Player");
}

function addNewCard() {
	console.log("Adding new Card");
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

function applyZoneChanges() {
	var zoneForm = document.getElementById("zone_form");
	var zone = currentZone;
	var zoneGUI = lookupZoneGUI(zone);

	var attrSelect = document.getElementById("zoneAttrSelect");
	var attrValue = document.getElementById("zoneAttrValue");
	
	if (attrSelect.value !== "")
	{
		zone.attributes[attrSelect.value] = attrValue.value;
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
	var attrValue = document.getElementById("cardAttrValue");
	
	if (attrSelect.value !== "")
	{
		card.attributes[attrSelect.value] = attrValue.value;
	}

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
	actionResultCode.setValue(resultString);

	var checkLegalityString = "" + window[actionTemplate.checkLegality];
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
		codeString = "" + window[gameDescription.gameName + "Setup"];
	}
	else if (mode === "Win Condition")
	{
		codeString = "" + window[gameDescription.gameName + "WinCondition"];
	}
	else if (mode === "State Score")
	{
		codeString = "" + window[gameDescription.gameName + "StateScore"];
	}

	otherCode.setValue(codeString);
}

function applyOtherChanges() {
	var newCode;
	newCode = eval("(" + otherCode.getValue() + ")");
	if (currentOther === "Setup Function")
	{
		window[gameDescription.gameName + "Setup"] = newCode;
	}
	else if (currentOther === "Win Condition")
	{
		window[gameDescription.gameName + "WinCondition"] = newCode;
	}
	else if (currentOther === "State Score")
	{
		window[gameDescription.gameName + "StateScore"] = newCode;
	}
}

function saveGame(gameName) {
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

	jsonRoot.gameName = gameDescription.gameName;

	jsonRoot.setupFunction = gameDescription.setupFunction;

	jsonRoot.winCondition = gameDescription.winCondition;

	jsonRoot.stateScore = gameDescription.stateScore;

	jsonRoot.phases = gameDescription.phases;
	
	//console.log(JSON.stringify(jsonRoot));
	return JSON.stringify(jsonRoot, null, "\t");
}

function exportJavaScript (newGameName) {
	var gName = newGameName;//gameDescription.gameName;
	var jsFile = "//" + gName + "\n\n";

	//-Setup
	var setupFunc = window[gameDescription.setupFunction];
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
	var winCond = window[gameDescription.winCondition];
	jsFile += winCond + "\n\n";

	//-State Score
	var stateScore = window[gameDescription.stateScore];
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