/*
DESIGN-TIME GUI
*/

var currentSelection;

function initDesign() {
	var canvas = document.getElementById("Canvas2D");
	var ctx = canvas.getContext('2d');

	//canvas.width = (window.innerWidth - 20) * 0.75;

	designArea = document.getElementById("design_area");
	designArea.style.display = "inline-block";
	designArea.style.position = "absolute";
	designArea.style.left = "0px";
	designArea.style.top = "0px";

	designing = true;
}

function endDesign() {
	var canvas = document.getElementById("Canvas2D");
	var ctx = canvas.getContext('2d');

	//canvas.width = window.innerWidth - 20;

	designArea = document.getElementById("design_area");
	designArea.style.display = "none";

	designing = false;
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
	var zoneInfo = document.getElementById("zone_info")
	zoneInfo.style.display = "none";
	document.getElementById("player_checkboxes").innerHTML = "";
	document.getElementById("zoneAttrSelect").innerHTML = "";
	document.getElementById("edit_attributes").style.visibility = "hidden";
}

function fillZoneInfo (zone, x, y) {
	var zoneInfo = document.getElementById("zone_info");
	zoneInfo.style.display = "inline";

	var zoneForm = document.getElementById("zone_form");
	zoneForm.zoneName.value = zone.name;

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

    	var checkboxDiv = document.getElementById("player_checkboxes");
    	checkboxDiv.appendChild(newCheckbox);
    	checkboxDiv.appendChild(text);
	};

	positionZoneInfo(x, y);
	currentSelection = zone;
}

function positionZoneInfo (x, y) {
	var zoneInfo = document.getElementById("zone_info");

	/*
	var zoneGUI = lookupZoneGUI(zone);
	var editWindowX = zoneGUI.x + (zoneGUI.width / 2);
	var editWindowY = zoneGUI.y + (zoneGUI.height / 2);
	*/

	var editWindowX = x + 9;
	var editWindowY = y + 9;

	zoneInfo.style.position = "absolute";
	zoneInfo.style.left = "" + editWindowX + "px";
	zoneInfo.style.top = "" + editWindowY + "px";
	//zIndex?
}

function fillZoneAttributeInfo () {
	var attrSelect = document.getElementById("zoneAttrSelect");
	var attrName = document.getElementById("attrName");
	var attrValue = document.getElementById("attrValue");

	document.getElementById("edit_attributes").style.visibility = "visible";

	attrName.value = attrSelect.value;
	attrValue.value = currentSelection.attributes[attrSelect.value];
	
}

function applyZoneChanges() {
	var zoneForm = document.getElementById("zone_form");
	var zone = currentSelection;
	var zoneGUI = lookupZoneGUI(zone);

	for (var i = 0; i < currentGS.cards.length; i++) {
		if (currentGS.cards[i].zone == zone.name)
		{
			currentGS.cards[i].zone = zoneForm.zoneName.value;
		}
	};
	zoneGUI.name = zoneForm.zoneName.value;
	zone.name = zoneForm.zoneName.value;

	var attrSelect = document.getElementById("zoneAttrSelect");
	var attrName = document.getElementById("attrName");
	var attrValue = document.getElementById("attrValue");

	zone.attributes[attrName.value] = attrValue.value;

	zone.type = zoneForm.zoneType.value;

	var visibleArr = [];
	var playerBoxes = document.getElementById("player_checkboxes");
	for (var i = 0; i < (playerBoxes.childNodes.length / 2); i++) {
		if (playerBoxes.childNodes[i * 2].checked)
		{
			visibleArr.push(playerBoxes.childNodes[i * 2].name);
		}
	};
	zone.visibleTo = visibleArr;
	return false;
}

function exportJSON() {
	var jsonRoot = {};
	jsonRoot.zones = [];
	for (var i = 0; i < currentGS.zones.length; i++) {
		var curZone = currentGS.zones[i];
		var tempZone = {};
		tempZone.name = curZone.name;
		//fix this attribute thing!
		tempZone.attributes = curZone.attributes;
		tempZone.type = curZone.type;
		tempZone.visibleTo = curZone.visibleTo;

		jsonRoot.zones.push(tempZone);
	};

	jsonRoot.zoneGUI = [];
	for (var i = 0; i < zonesGUIInfo.length; i++) {
		var curGUIInfo = zonesGUIInfo[i];
		var tempGUI = {};
		tempGUI.name = curGUIInfo.name;
		tempGUI.xPct = curGUIInfo.xPct;	
		tempGUI.yPct = curGUIInfo.yPct;

		jsonRoot.zoneGUI.push(tempGUI);
	};
	
	console.log(JSON.stringify(jsonRoot));
}