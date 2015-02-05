/**
* A place that contains cards
*
* @class Zone
* @constructor
* @param {String} name - the name of the zone, must be unique
* @param {Object} attributes - all designer defined attributes for the zone
* @param {String} type - determines how the cards in the zone are displayed
* @param {Array} visibleTo - an array of all players the cards in the zone are visible to
*/
function Zone(name, attributes, type, visibleTo)
{
	this.name = name;
	this.attributes = attributes;
	this.cards = [];
	this.type = type;
	this.visibleTo = visibleTo;
}
/**
* Determines whether the given player can view the zone
* @method Zone.prototype.isVisibleTo
* @param {String} playerName - the name of the player being checked
* @return {Boolean} Returns whether or not the cards in the zone are visible to the given player
*/
Zone.prototype.isVisibleTo = function(playerName) {
	for (var i = 0; i < this.visibleTo.length; i++) 
	{
		if (this.visibleTo[i] == playerName)
		{
			return true;
		}
	};
	return false;
};
/**
* Creates a clone of the zone
* @method Zone.prototype.clone
* @return {Zone} Returns a copy of the zone
*/
Zone.prototype.clone = function() {
	var zoneClone = new Zone(this.name, objectClone(this.attributes), this.type, objectClone(this.visibleTo));
	zoneClone.cards = objectClone(this.cards);
	return zoneClone;
};