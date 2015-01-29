// GUI

/*
Things to add to game description JSON:


*/

var CARD_WIDTH = 70;
var CARD_HEIGHT = 100;
var CARD_OUTLINE_WEIGHT = "3";
var CARD_DEFAULT_FONT_SIZE = 20;

var ZONE_OUTLINE_WEIGHT = "3";
var ZONE_MARGIN = 10;

var POPUP_OUTLINE_WEIGHT = "2";
var POPUP_FONT_SIZE = 16;
var POPUP_MARGIN = 5;

var DECK_OFFSET = 3;

var SHOW_ZONE_NAMES = true;

var canvas;
var ctx;

var mouseX;
var mouseY;

var cardsGUIInfo = [];
var zonesGUIInfo = [];

var waitingForPlayerInput = false;
var queuedAction;
var inputTypes = [];
var currentInput = 0;

// The game player that is using the GUI (defaults to the first player in the player list)
var guiPlayer;

var popUpMenus = [];

window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

function Init () {
	requestAnimFrame(Update);
	canvas = document.getElementById("Canvas2D");
	ctx = canvas.getContext('2d');

	initCardGUIInfo(currentGS);
	initZoneGUIInfo(currentGS);

	zoneGridLayout(currentGS.zones)

	updateGUI(currentGS);

	guiPlayer = currentGS.players[0];
}

function Update () {
	requestAnimFrame(Update);
	renderFrame();
}

function renderFrame () {
	if (!currentGS)
	{
		return;
	}
	clearFrame();

	updateGUI(currentGS);

	//QUICK FIX
	zoneGridLayout(currentGS.zones);

	drawAllZones(currentGS);
	drawAllCards(currentGS);
	drawAllPopUpMenus();

}

function clearFrame () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function CardGUIInfo (card)
{
	this.id = card.id;
	this.x = 0;
	this.y = 0;
	this.width = CARD_WIDTH;
	this.height = CARD_HEIGHT;
	this.fontSize = CARD_DEFAULT_FONT_SIZE;
}

function ZoneGUIInfo (zone)
{
	this.name = zone.name;
	this.x = 0;
	this.y = 0;
	this.width = getZoneWidth(zone);
	this.height = getZoneHeight(zone);
}

function initCardGUIInfo (gs) {
	for (var i = 0; i < gs.cards.length; i++) {
		var newCardInfo = new CardGUIInfo(gs.cards[i]);
		cardsGUIInfo.push(newCardInfo);
	};
}

function initZoneGUIInfo (gs) {
	for (var i = 0; i < gs.zones.length; i++) {
		var newZoneInfo = new ZoneGUIInfo(gs.zones[i]);
		zonesGUIInfo.push(newZoneInfo);
	};
}

function lookupCardGUI(card)
{
	for(var i = 0; i < cardsGUIInfo.length; i += 1)
	{
		if (cardsGUIInfo[i].id == card.id)
		{
			return cardsGUIInfo[i];
		}
	}
	console.log("Could not find cardGUIInfo with id \"" + card.id + "\".");
	throw new Error("CardGUIInfo Lookup Error");
	return false;
}; 

function lookupZoneGUI(zone)
{
	for(var i = 0; i < zonesGUIInfo.length; i += 1)
	{
		if (zonesGUIInfo[i].name == zone.name)
		{
			return zonesGUIInfo[i];
		}
	}
	console.log("Could not find zoneGUIInfo with name \"" + zone.name + "\".");
	throw new Error("ZoneGUIInfo Lookup Error");
	return false;
}; 

function updateGUI (gs) {
	for (var i = 0; i < gs.zones.length; i++) {
		updateZone(gs.zones[i]);
	};

	updateCardsInZones(gs);
}

// Drawing functions

function updateCard (card, x, y) {
	var cardInfo = lookupCardGUI(card);

	cardInfo.x = x;
	cardInfo.y = y;
}

function drawCard (card) {
	var cardGUI = lookupCardGUI(card);

	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = CARD_OUTLINE_WEIGHT;
	ctx.strokeStyle = "black";
	ctx.rect(cardGUI.x, cardGUI.y, cardGUI.width, cardGUI.height);
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	var cardTextX = cardGUI.x + (cardGUI.width / 2);
	var cardTextY = cardGUI.y + (cardGUI.height / 2) + (cardGUI.fontSize / 4);
	//ctx.fillText(card.value, cardTextX, cardTextY, cardGUI.width);
	if (card.isVisibleTo(guiPlayer.name, currentGS))
	{
		ctx.fillText(card.attributes.value, cardTextX, cardTextY, cardGUI.width);
	}
	ctx.restore();

}

function drawAllCards (gs) {
	for (var i = 0; i < gs.cards.length; i++) {
		drawCard(gs.cards[i]);
	};
}

function drawZoneBox (x, y, width, height, name) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = ZONE_OUTLINE_WEIGHT;
	ctx.strokeStyle = "#999999";
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.restore();

	if (SHOW_ZONE_NAMES)
	{
		ctx.save();
		ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
		ctx.fillStyle = "#999999";
		ctx.textAlign = "left";
		ctx.fillText(name, x, y - ZONE_OUTLINE_WEIGHT, width);
		ctx.restore();
	}
}

// ADD TYPE TO ZONE DEFINITION
function updateZone (zone) {
	var zoneWidth = getZoneWidth(zone);
	var zoneHeight = getZoneHeight(zone);
	var zoneGUI = lookupZoneGUI(zone);

	zoneGUI.width = zoneWidth;
	zoneGUI.height = zoneHeight;
}

function drawZone (zone) {
	var zoneGUI = lookupZoneGUI(zone);
	drawZoneBox(zoneGUI.x, zoneGUI.y, zoneGUI.width, zoneGUI.height, zone.name);
}

function updateCardsInZones (gs) {
	for (var h = 0; h < gs.zones.length; h++) {
		var zone = gs.zones[h];
		var zoneGUI = lookupZoneGUI(zone);
		var x = zoneGUI.x;
		var y = zoneGUI.y;

		if (zone.type == "deck")
		{
			zoneWidth = getZoneWidth(zone);
			zoneHeight = getZoneHeight(zone);

			var currentX = x + ZONE_MARGIN;
			var currentY = y + ZONE_MARGIN;
			for (var i = 0; i < zone.cards.length; i++) {
				var currentCard = lookupCard(zone.cards[i], gs);
				if (i == zone.cards.length - 1)
				{
					updateCard(currentCard, currentX, currentY);
				}
				else if (i == zone.cards.length - 2)
				{
					updateCard(currentCard, currentX - DECK_OFFSET, currentY - DECK_OFFSET);
				}
				else
				{
					updateCard(currentCard, currentX - (DECK_OFFSET * 2), currentY - (DECK_OFFSET * 2));
				}
			};

		}
		else if (zone.type == "showEachCard")
		{
			if (zone.cards.length > 0)
			{
				var numCards = zone.cards.length;
			}
			else
			{
				var numCards = 1;
			}
			zoneWidth = getZoneWidth(zone);
			zoneHeight = getZoneHeight(zone);

			var currentX = x + ZONE_MARGIN;
			var currentY = y + ZONE_MARGIN;
			for (var i = 0; i < zone.cards.length; i++) {
				var currentCard = lookupCard(zone.cards[i], gs);
				updateCard(currentCard, currentX, currentY);
				currentX += CARD_WIDTH;
				currentX += ZONE_MARGIN;
			};
		}
	};
}

function getZoneWidth (zone) {
	var numCards = 1;
	if (zone.cards.length > 0)
	{
		numCards = zone.cards.length;
	}
	if (zone.type == "showEachCard")
	{
		return (numCards * CARD_WIDTH) + ((numCards + 1) * ZONE_MARGIN);
	}
	else if (zone.type == "deck")
	{
		return CARD_WIDTH + (ZONE_MARGIN * 2);	
	}
}

function getZoneHeight (zone) {
	var zoneHeight = CARD_HEIGHT + (ZONE_MARGIN * 2);
	return zoneHeight;
}

// Temporary function: draws final two zones in zone list as player hands, draws rest as grid (3 per line) in center of canvas.
function zoneGridLayout (fullZoneList) {
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;

	//ZONES_PER_LINE = 3;

	zoneList = fullZoneList.slice(0, fullZoneList.length - 2);

	var numRows = Math.ceil(zoneList.length / ZONES_PER_LINE);

	var grid = [[]];
	var currentRow = 0;
	var currentColumn = 0;

	for (var i = 0; i < zoneList.length; i++) {
		grid[currentRow][currentColumn] = zoneList[i];

		if (i % ZONES_PER_LINE == ZONES_PER_LINE - 1)
		{
			currentRow++;
			currentColumn = 0;
			grid[currentRow] = [];
		}
		else
		{
			currentColumn++;
		}
	};

	var rowHeight = getZoneHeight(grid[0][0]);
	if (SHOW_ZONE_NAMES)
	{
		rowHeight += CARD_DEFAULT_FONT_SIZE;
	}
	
	var gridHeight = (numRows * rowHeight) + ((numRows - 1) * ZONE_MARGIN);

	var rowLengths = [];

	for (var i = 0; i < numRows; i++) {
		var rowLength = 0;
		for (var j = 0; j < grid[i].length; j++) {
			rowLength += getZoneWidth(grid[i][j]);
			rowLength += ZONE_MARGIN;
		};
		rowLengths[i] = rowLength;
	};

	var currentX = centerX - (rowLengths[0] / 2);
	var currentY = centerY - (gridHeight / 2);

	// Draw rows
	for (var i = 0; i < numRows; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var curZoneGUI = lookupZoneGUI(grid[i][j]);
			curZoneGUI.x = currentX;
			curZoneGUI.y = currentY;
			currentX += curZoneGUI.width;
			currentX += ZONE_MARGIN;
		};
		currentY += rowHeight;
		currentY += ZONE_MARGIN;
		currentX = centerX - (rowLengths[0] / 2);
	};

	var p1HandGUI = lookupZoneGUI(fullZoneList[zoneList.length]);
	p1HandGUI.x = (canvas.width / 2) - (p1HandGUI.width / 2)
	p1HandGUI.y = (canvas.height) - (p1HandGUI.height);

	var p2Height = 0;
	if (SHOW_ZONE_NAMES)
	{
		p2Height += CARD_DEFAULT_FONT_SIZE;
	}
	var p2HandGUI = lookupZoneGUI(fullZoneList[zoneList.length + 1]);
	p2HandGUI.x = (canvas.width / 2) - (p2HandGUI.width / 2)
	p2HandGUI.y = p2Height;
}

function drawAllZones (gs) {
	for (var i = 0; i < gs.zones.length; i++) {
		drawZone(gs.zones[i]);
	};
}

function findCard (x, y) {
	for (var i = cardsGUIInfo.length - 1; i >= 0; i--) {
		var cardGUI = cardsGUIInfo[i];
		var card = lookupCard(cardGUI.id, currentGS);
		if (x >= cardGUI.x && x <= (cardGUI.x + cardGUI.width) && y >= cardGUI.y && y <= (cardGUI.y + cardGUI.height))
		{
			//console.log(card);
			return card;
		}
	};
	return false;
}

function findPopUpMenu (x, y) {
	var returnMenu;
	for (var i = 0; i < popUpMenus.length; i++) {
		var menu = popUpMenus[i];
		if (x >= menu.x && x <= (menu.x + menu.width) && y >= menu.y && y <= (menu.y + menu.height))
		{
			return menu;
		}
	};
	return false;
}

function findZone (x, y) {
	var returnZone;
	for (var i = 0; i < currentGS.zones.length; i++) {
		var zone = currentGS.zones[i];
		var zoneGUI = lookupZoneGUI(zone);
		if (x >= zoneGUI.x && x <= (zoneGUI.x + zoneGUI.width) && y >= zoneGUI.y && y <= (zoneGUI.y + zoneGUI.height))
		{
			return zone;
		}
	};
	return false;
}

function PopUpMenu (x, y, options) {
	this.x = x;
	this.y = y;
	this.options = options;
	this.height = this.options.length * POPUP_FONT_SIZE + (POPUP_MARGIN * 2);

	ctx.save();
	ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Arial";

	this.width = 0;

	for (var i = 0; i < options.length; i++) {
		var stringWidth = ctx.measureText(options[i].template.description).width + (POPUP_MARGIN * 2);
		if (stringWidth > this.width)
		{
			this.width = stringWidth;
		}
	};

	ctx.restore();

	if ((this.y + this.height) > canvas.height)
	{
		this.y = this.y - this.height;
	}

	this.draw = function () {		
		ctx.save();

		var menuY = this.y;

		ctx.beginPath();
		ctx.lineWidth = CARD_OUTLINE_WEIGHT;
		ctx.strokeStyle = "black";
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.stroke();
		ctx.fillStyle = "white";
		ctx.fill();

		ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "left";

		var currentY = this.y + POPUP_FONT_SIZE + POPUP_MARGIN;
		var currentX = this.x + POPUP_MARGIN;

		for (var i = 0; i < options.length; i++) {
			ctx.fillText(options[i].template.description, currentX, currentY);
			currentY += POPUP_FONT_SIZE;
		};

		ctx.restore();
	}

	this.getOption = function (x, y) {
		var topY = this.y + POPUP_MARGIN;
		var bottomY = this.y + this.height - POPUP_MARGIN;
		var activeHeight = bottomY - topY;
		var optionHeight = activeHeight / this.options.length;

		var localY = y - topY;

		if (localY > 0 && localY < activeHeight)
		{
			var optionIndex = Math.floor(localY / optionHeight);
			var actionToDo = options[optionIndex];
			//console.log(actionToDo);

			var actionTemp = actionToDo.template;

			if (actionTemp.inputTypes.length == 0)
			{
				applyAction(actionToDo, guiPlayer, currentGS);
			}
			else
			{
				queuedAction = actionToDo;
				inputTypes = actionTemp.inputTypes;
				currentInput = 0;
				waitingForPlayerInput = true;
			}
			removePopUpMenu(this);
		}
	}
}

function drawAllPopUpMenus () {
	for (var i = 0; i < popUpMenus.length; i++) {
		popUpMenus[i].draw();
	};
}

function addActionMenu (card, x, y) {
	var actionList = generateActionsWithoutInputs(card, currentGS);

	var menuOptions = [];
	for (var i = 0; i < actionList.length; i++) {
		menuOptions.push(actionList[i]);
	};

	var moveMenu = new PopUpMenu(x, y, menuOptions);
	popUpMenus.push(moveMenu);
}

function removePopUpMenu (menu) {
	for (var i = popUpMenus.length - 1; i >= 0; i--) {
		if (popUpMenus[i] === menu)
		{
			popUpMenus.splice(i, 1);
		}
	};
}

function MousePos (e) {

}

function hoverOn (e) {
	
}

function hoverOff (e) {
	
}

window.addEventListener('mousedown', DoMouseDown, true);

// Mouse down event
function DoMouseDown (e) {
	var mouseX = e.pageX - 8;
	var mouseY = e.pageY - 8;

	if (waitingForPlayerInput)
	{
		var inputType = inputTypes[currentInput];
		if (inputType == "zone")
		{
			var clickedZone = findZone(mouseX, mouseY);
			if (clickedZone)
			{
				queuedAction.inputs.push(clickedZone.name);
				currentInput += 1;
				if (currentInput >= queuedAction.template.inputTypes.length)
				{
					applyAction(queuedAction, guiPlayer, currentGS);
					waitingForPlayerInput = false;
				}
			}
		}
	}
	else
	{
		var clickedMenu = findPopUpMenu(mouseX, mouseY);
		if (clickedMenu)
		{
			clickedMenu.getOption(mouseX, mouseY);
		}
		else
		{
			var clickedCard = findCard(mouseX, mouseY);
			if (clickedCard)
			{
				popUpMenus = [];
				addActionMenu(clickedCard, mouseX, mouseY);
			}
			else
			{
				popUpMenus = [];
			}
		}
	}
}