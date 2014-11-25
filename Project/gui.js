// GUI

/*
Things to add to game description JSON:

 - Zone type: deck, showEachCard
*/

var CARD_WIDTH = 70;
var CARD_HEIGHT = 100;
var CARD_OUTLINE_WEIGHT = "3";
var CARD_DEFAULT_FONT_SIZE = 20;

var ZONE_OUTLINE_WEIGHT = "3";
var ZONE_MARGIN = 10;

var canvas = document.getElementById('Canvas2D');
var ctx = canvas.getContext('2d');

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

	//TESTING
	drawCard(50, 50, {value: "Hello"});
	drawZoneBox(40, 40, CARD_WIDTH + 20, CARD_HEIGHT + 20);
}

function clearFrame () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// Drawing functions

function drawCard (x, y, card) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = CARD_OUTLINE_WEIGHT;
	ctx.strokeStyle = "black";
	ctx.rect(x, y, CARD_WIDTH, CARD_HEIGHT);
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	var cardTextX = x + (CARD_WIDTH / 2);
	var cardTextY = y + (CARD_HEIGHT / 2) + (CARD_DEFAULT_FONT_SIZE / 4);
	ctx.fillText(card.value, cardTextX, cardTextY, CARD_WIDTH);
	ctx.restore();
}

function drawZoneBox (x, y, width, height, name) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = ZONE_OUTLINE_WEIGHT;
	ctx.strokeStyle = "#999999";
	ctx.rect(x, y, width, height);
	ctx.stroke();
	ctx.restore();

	if (name)
	{
		ctx.save();
		ctx.font = "" + CARD_DEFAULT_FONT_SIZE + "px Georgia";
		ctx.fillStyle = "#999999";
		ctx.textAlign = "left";
		ctx.fillText(name, x, y);
		ctx.restore();
	}
}

// ADD TYPE TO ZONE DEFINITION
function drawZone (zone, type, x, y) {
	var zoneWidth;
	var zoneHeight;

	//if (zone.type == "deck")
	if (type == "deck")
	{
		zoneWidth = CARD_WIDTH + (ZONE_MARGIN * 2);
		zoneHeight = CARD_HEIGHT + (ZONE_MARGIN * 2);
	}
	//else if (zone.type == "showEachCard")
	else if (type == "showEachCard")
	{
		var numCards = zone.cards[0].length;
		zoneWidth = (numCards * CARD_WIDTH) + ((numCards + 1) * ZONE_MARGIN);
		zoneHeight = CARD_HEIGHT + (ZONE_MARGIN * 2);
	}

	drawZoneBox(x, y, zoneWidth, zoneHeight);

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
	
}