// GUI

/*
Things to add to game description JSON:

 - Zone type: deck, showEachCard
 - showZoneName bool?
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

var SHOW_ZONE_NAMES = true;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

var mouseX;
var mouseY;

//var onScreenCards = [];

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
	onScreenCards = [];

	//TESTING
	//drawCard(50, 50, {value: "Hello"});
	//drawZoneBox(40, 40, CARD_WIDTH + 20, CARD_HEIGHT + 20, "Hello Zone");
	zoneGridLayout();
	drawPlayersHands();
	drawAllCards();
	drawAllPopUpMenus();

}

function clearFrame () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Drawing functions

function addCard (card, x, y) {
	var newCard = card;

	newCard.x = x;
	newCard.y = y;
	newCard.width = CARD_WIDTH;
	newCard.height = CARD_HEIGHT;

	/*var foundCard = false;
	for (var i = 0; i < onScreenCards.length; i++) {
		//if (onScreenCards[i].x == card.x && onScreenCards[i].y == card.y)
		if (onScreenCards[i] === card)
		{
			foundCard = true;
		}
	};

	if (!foundCard)
	{
		onScreenCards.push(card);
	}*/

	//onScreenCards.push(newCard);

}

function drawCard (card) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = CARD_OUTLINE_WEIGHT;
	ctx.strokeStyle = "black";
	ctx.rect(card.x, card.y, CARD_WIDTH, CARD_HEIGHT);
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	var cardTextX = card.x + (CARD_WIDTH / 2);
	var cardTextY = card.y + (CARD_HEIGHT / 2) + (CARD_DEFAULT_FONT_SIZE / 4);
	ctx.fillText(card.value, cardTextX, cardTextY, CARD_WIDTH);
	ctx.restore();

}

function drawAllCards () {
	for (var i = 0; i < cards.length; i++) {
		drawCard(cards[i]);
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
function drawZone (zone, x, y) {
	var zoneWidth;
	var zoneHeight;

	// PLACEHOLDER
	zone.type = "showEachCard"

	if (zone.type == "deck")
	{
		zoneWidth = CARD_WIDTH + (ZONE_MARGIN * 2);
		zoneHeight = getZoneHeight(zone);
	}
	else if (zone.type == "showEachCard")
	{
		if (zone.cards[0])
		{
			var numCards = zone.cards.length;
		}
		else
		{
			var numCards = 1;
		}
		zoneWidth = getZoneWidth(zone);
		zoneHeight = getZoneHeight(zone);

		currentX = x + ZONE_MARGIN;
		currentY = y + ZONE_MARGIN;
		for (var i = 0; i < zone.cards.length; i++) {
			addCard(zone.cards[i], currentX, currentY);
			currentX += CARD_WIDTH;
			currentX += ZONE_MARGIN;
		};
	}

	drawZoneBox(x, y, zoneWidth, zoneHeight, zone.name);

}

function getZoneWidth (zone) {
	var numCards = 1;
	if (zone.cards[0] != undefined)
	{
		numCards = zone.cards.length;
	}
	return (numCards * CARD_WIDTH) + ((numCards + 1) * ZONE_MARGIN);
}

function getZoneHeight (zone) {
	var zoneHeight = CARD_HEIGHT + (ZONE_MARGIN * 2);
	return zoneHeight;
}

function zoneGridLayout () {
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;

	var numRows = Math.ceil(currentGS.zones.length / ZONES_PER_LINE);

	var grid = [[]];
	var currentRow = 0;
	var currentColumn = 0;

	for (var i = 0; i < currentGS.zones.length; i++) {
		grid[currentRow][currentColumn] = currentGS.zones[i];

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
		//var rowLength = ZONE_MARGIN;
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
			drawZone(grid[i][j], currentX, currentY);
			currentX += getZoneWidth(grid[i][j]);
			currentX += ZONE_MARGIN;
		};
		currentY += rowHeight;
		currentY += ZONE_MARGIN;
		currentX = centerX - (rowLengths[0] / 2);
	};
}

function drawPlayersHands () {
	drawZone(currentGS.players[0], (canvas.width / 2) - (getZoneWidth(currentGS.players[0]) / 2), (canvas.height) - (getZoneHeight(currentGS.players[0])));
	var player2Height = 0;
	if (SHOW_ZONE_NAMES)
	{
		player2Height += CARD_DEFAULT_FONT_SIZE;
	}
	drawZone(currentGS.players[1], (canvas.width / 2) - (getZoneWidth(currentGS.players[1]) / 2), player2Height);
}

function findCard (x, y) {
	var returnCard;
	for (var i = 0; i < cards.length; i++) {
		var card = cards[i];
		if (x >= card.x && x <= (card.x + card.width) && y >= card.y && y <= (card.y + card.height))
		{
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

function PopUpMenu (x, y, options) {
	this.x = x;
	this.y = y;
	this.options = options;
	this.height = this.options.length * POPUP_FONT_SIZE + (POPUP_MARGIN * 2);

	ctx.save();
	ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Arial";

	this.width = 0;

	for (var i = 0; i < options.length; i++) {
		var stringWidth = ctx.measureText(options[i].description).width + (POPUP_MARGIN * 2);
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
			ctx.fillText(options[i].description, currentX, currentY);
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
			var moveToDo = options[optionIndex];
			playerMove(moveToDo, currentGS);
			removePopUpMenu(this);
		}
	}
}

function drawAllPopUpMenus () {
	for (var i = 0; i < popUpMenus.length; i++) {
		popUpMenus[i].draw();
	};
}

function addMoveMenu (card, x, y) {
	var moveList = generateMovesFromCard(card);

	var menuOptions = [];
	for (var i = 0; i < moveList.length; i++) {
		menuOptions.push(moveList[i]);
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
	var mouseX = e.x - 8;
	var mouseY = e.y - 8;
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
			addMoveMenu(clickedCard, mouseX, mouseY);
		}
		else
		{
			popUpMenus = [];
		}
	}
}