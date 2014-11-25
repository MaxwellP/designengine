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

var SHOW_ZONE_NAMES = true;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

var mouseX;
var mouseY;

var onScreenCards = [];

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
	clearFrame();
	onScreenCards = [];

	//TESTING
	//drawCard(50, 50, {value: "Hello"});
	//drawZoneBox(40, 40, CARD_WIDTH + 20, CARD_HEIGHT + 20, "Hello Zone");
	zoneGridLayout();
	drawPlayersHands();
	drawAllCards();

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

	onScreenCards.push(newCard);

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
	for (var i = 0; i < onScreenCards.length; i++) {
		drawCard(onScreenCards[i]);
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

	var numRows = Math.ceil(zones.length / ZONES_PER_LINE);

	var grid = [[]];
	var currentRow = 0;
	var currentColumn = 0;

	for (var i = 0; i < zones.length; i++) {
		grid[currentRow][currentColumn] = zones[i];

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
	drawZone(players[0], (canvas.width / 2) - (getZoneWidth(players[0]) / 2), (canvas.height) - (getZoneHeight(players[0])));
	var player2Height = 0;
	if (SHOW_ZONE_NAMES)
	{
		player2Height += CARD_DEFAULT_FONT_SIZE;
	}
	drawZone(players[1], (canvas.width / 2) - (getZoneWidth(players[1]) / 2), player2Height);
}

function findCard (x, y) {
	var returnCard;
	for (var i = 0; i < onScreenCards.length; i++) {
		var card = onScreenCards[i];
		if (x >= card.x && x <= (card.x + card.width) && y >= card.y && y <= (card.y + card.height))
		{
			console.log(card);
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
	findCard(e.x, e.y);
}