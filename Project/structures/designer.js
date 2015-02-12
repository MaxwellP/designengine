/*
DESIGN-TIME GUI
*/

function initDesign() {
	var canvas = document.getElementById("Canvas2D");
	var ctx = canvas.getContext('2d');

	canvas.width = (window.innerWidth - 20) * 0.75;

	designArea = document.getElementById("design_area");
	designArea.style.display = "inline-block";

	designing = true;
}

function endDesign() {
	var canvas = document.getElementById("Canvas2D");
	var ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth - 20;

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
}

function fillZoneInfo (zone) {
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
}

function applyChanges() {

}