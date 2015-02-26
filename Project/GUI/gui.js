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

//var mouseX;
//var mouseY;

var initZoneGUI;

var cardsGUIInfo = [];
var zonesGUIInfo = [];

var waitingForPlayerInput = false;
var queuedAction;
var inputTypes = [];
var currentInput = 0;

var draggingZone = false;
var dragZoneGUIInfo;
var draggingCard = false;
var dragCardGUIInfo;
var prevX;
var prevY;

var emptyClick = false;

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

	canvas.addEventListener('mousedown', DoMouseDown, true);
	canvas.addEventListener('mouseup', DoMouseUp, true);

	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 20;

	initCardGUIInfo(currentGS);
	initZoneGUIInfo(currentGS);

	//zoneGridLayout(currentGS.zones)

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
	//zoneGridLayout(currentGS.zones);

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
	this.z = 0;
	this.width = CARD_WIDTH;
	this.height = CARD_HEIGHT;
	this.fontSize = CARD_DEFAULT_FONT_SIZE;
	this.dragging = false;
}

function ZoneGUIInfo (zone, xPct, yPct)
{
	this.name = zone.name;
	this.x = 0;
	this.y = 0;
	this.xPct = xPct;
	this.yPct = yPct;
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
		var guiObj = lookupInitZoneGUI(gs.zones[i].name);
		var newZoneInfo = new ZoneGUIInfo(gs.zones[i], guiObj.xPct, guiObj.yPct);
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

function lookupInitZoneGUI(zoneName)
{
	for(var i = 0; i < initZoneGUI.length; i += 1)
	{
		if (initZoneGUI[i].name == zoneName)
		{
			return initZoneGUI[i];
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

function updateCard (card, x, y, z) {
	var cardInfo = lookupCardGUI(card);

	cardInfo.x = x;
	cardInfo.y = y;
	cardInfo.z = z;
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
	ctx.textAlign = "left";
	//var cardTextX = cardGUI.x + (cardGUI.width / 2);
	//var cardTextY = cardGUI.y + (cardGUI.height / 2) + (cardGUI.fontSize / 4);
	var cardTextX = cardGUI.x;
	var cardTextY = cardGUI.y + (cardGUI.fontSize / 2) + 5;
	//ctx.fillText(card.value, cardTextX, cardTextY, cardGUI.width);
	if (card.isVisibleTo(guiPlayer.name, currentGS))
	{
		ctx.fillText(card.name, cardTextX, cardTextY, cardGUI.width);
	}
	ctx.restore();

}

function drawAllCards (gs) {
	cardsGUIInfo.sort(cardCompare);
	for (var i = 0; i < cardsGUIInfo.length; i++) {
		drawCard(lookupCard(cardsGUIInfo[i].id, gs));
	};
}

function cardCompare(a, b) {
	return a.z - b.z;
}

function drawZoneBox (x, y, width, height, name) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = ZONE_OUTLINE_WEIGHT;
	ctx.strokeStyle = "#999999";
	ctx.rect(x - (width / 2), y - (height / 2), width, height);
	ctx.stroke();
	ctx.restore();

	if (SHOW_ZONE_NAMES)
	{
		ctx.save();
		ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
		ctx.fillStyle = "#999999";
		ctx.textAlign = "left";
		ctx.fillText(name, x - (width / 2), y - (height / 2) - ZONE_OUTLINE_WEIGHT, width);
		ctx.restore();
	}
}

// ADD TYPE TO ZONE DEFINITION
function updateZone (zone) {
	var zoneWidth = getZoneWidth(zone);
	var zoneHeight = getZoneHeight(zone);
	var zoneGUI = lookupZoneGUI(zone);

	if (!draggingZone)
	{
		zoneGUI.x = canvas.width * zoneGUI.xPct;
		zoneGUI.y = canvas.height * zoneGUI.yPct;
	}

	zoneGUI.width = zoneWidth;
	zoneGUI.height = zoneHeight;
}

function updatePercents (zoneGUI) {
	zoneGUI.xPct = (zoneGUI.x / canvas.width);
	zoneGUI.yPct = (zoneGUI.y / canvas.height);
}

function drawZone (zone) {
	var zoneGUI = lookupZoneGUI(zone);
	drawZoneBox(zoneGUI.x, zoneGUI.y, zoneGUI.width, zoneGUI.height, zone.name);
}

function updateCardsInZones (gs) {
	for (var h = 0; h < gs.zones.length; h++) {
		var zone = gs.zones[h];
		var zoneGUI = lookupZoneGUI(zone);
		var x = zoneGUI.x - (zoneGUI.width / 2);
		var y = zoneGUI.y - (zoneGUI.height / 2);

		if (zone.type == "deck")
		{
			zoneWidth = getZoneWidth(zone);
			zoneHeight = getZoneHeight(zone);

			var currentX = x + ZONE_MARGIN;
			var currentY = y + ZONE_MARGIN;
			for (var i = 0; i < zone.cards.length; i++) {
				var currentCard = lookupCard(zone.cards[i], gs);
				var cardGUI = lookupCardGUI(currentCard);
				if (!cardGUI.dragging)
				{
					if (i == 0)
					{
						updateCard(currentCard, currentX, currentY, zone.cards.length);
					}
					else if (i == 1)
					{
						updateCard(currentCard, currentX - DECK_OFFSET, currentY - DECK_OFFSET, zone.cards.length - 1);
					}
					else
					{
						updateCard(currentCard, currentX - (DECK_OFFSET * 2), currentY - (DECK_OFFSET * 2), zone.cards.length - i);
					}
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

			var cardOffset = (zoneWidth - (2 * ZONE_MARGIN)) / zone.cards.length;
			if (cardOffset < CARD_WIDTH)
			{
				var overlap = CARD_WIDTH - cardOffset;
				cardOffset = (zoneWidth - (2 * ZONE_MARGIN) - overlap) / zone.cards.length;
			}

			var currentX = x + ZONE_MARGIN;
			var currentY = y + ZONE_MARGIN;
			for (var i = 0; i < zone.cards.length; i++) {
				var currentCard = lookupCard(zone.cards[i], gs);
				var cardGUI = lookupCardGUI(currentCard);
				if (!cardGUI.dragging)
				{
					updateCard(currentCard, currentX, currentY, i);
					//currentX += CARD_WIDTH;
					//currentX += ZONE_MARGIN;
				}
				currentX += cardOffset;
			};
		}
	};
}

function getZoneWidth (zone) {
	var numCards = 1;
	var zoneWidth;
	if (zone.cards.length > 0)
	{
		numCards = zone.cards.length;
	}
	if (zone.type == "showEachCard")
	{
		//zoneWidth = (numCards * CARD_WIDTH) + ((numCards + 1) * ZONE_MARGIN);
		zoneWidth = (numCards * CARD_WIDTH) + (2 * ZONE_MARGIN);
	}
	else if (zone.type == "deck")
	{
		zoneWidth = CARD_WIDTH + (ZONE_MARGIN * 2);	
	}

	if (zoneWidth > canvas.width)
	{
		zoneWidth = canvas.width;
	}
	return zoneWidth;
}

function getZoneHeight (zone) {
	var zoneHeight = CARD_HEIGHT + (ZONE_MARGIN * 2);
	return zoneHeight;
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
		if (x >= (zoneGUI.x - (zoneGUI.width / 2)) && x <= (zoneGUI.x + (zoneGUI.width / 2)) && y >= (zoneGUI.y - (zoneGUI.height / 2) - CARD_DEFAULT_FONT_SIZE) && y <= (zoneGUI.y + (zoneGUI.height / 2)))
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
	var mouseX = e.pageX - 8;
	var mouseY = e.pageY - 8;

	if (draggingZone)
	{
		dragZoneGUIInfo.x += (mouseX - prevX);
		dragZoneGUIInfo.y += (mouseY - prevY);

		prevX = mouseX;
		prevY = mouseY;

		positionZoneInfo(mouseX, mouseY);
	}

	if (draggingCard)
	{
		dragCardGUIInfo.x += (mouseX - prevX);
		dragCardGUIInfo.y += (mouseY - prevY);

		prevX = mouseX;
		prevY = mouseY;

		positionCardInfo(mouseX, mouseY);
	}
}

function hoverOn (e) {
	
}

function hoverOff (e) {
	
}

// Mouse down event
function DoMouseDown (e) {
	var mouseX = e.pageX - 8;
	var mouseY = e.pageY - 8;

	if (designing)
	{
		var clickedCard = findCard(mouseX, mouseY);
		if (clickedCard)
		{
			var cardGUI = lookupCardGUI(clickedCard);
			cardGUI.dragging = true;
			cardGUI.z = 10000000;
			draggingCard = true;
			dragCardGUIInfo = cardGUI;
			prevX = mouseX;
			prevY = mouseY;

			fillCardInfo(lookupCard(dragCardGUIInfo.id, currentGS), mouseX, mouseY);
		}
		else
		{
			var clickedZone = findZone(mouseX, mouseY);
			if (clickedZone) 
			{
				draggingZone = true;
				dragZoneGUIInfo = lookupZoneGUI(clickedZone);
				prevX = mouseX;
				prevY = mouseY;
			}
			else
			{
				emptyClick = true;
			}
		}
	}
}

function DoMouseUp (e) {
	var mouseX = e.pageX - 8;
	var mouseY = e.pageY - 8;

	if (designing)
	{
		var clickedZone = findZone(mouseX, mouseY);
		if (clickedZone) 
		{
			if (draggingCard)
			{
				if (clickedZone.name != lookupCard(dragCardGUIInfo.id, currentGS).zone)
				{
					Event.Move.Individual.toZone(dragCardGUIInfo.id, clickedZone.name, currentGS);
				}
			}
			else
			{
				hideAllInfo();
				fillZoneInfo(clickedZone, mouseX, mouseY);
			}
			
		}
		else if (emptyClick)
		{
			hideAllInfo();
			emptyClick = false;
		}

		if (draggingZone)
		{
			draggingZone = false;
			updatePercents(dragZoneGUIInfo);
		}

		if (draggingCard)
		{
			draggingCard = false;
			dragCardGUIInfo.dragging = false;
		}
	}
	else
	{
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
}