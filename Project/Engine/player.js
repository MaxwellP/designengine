/**
* A player who can take actions on the game
*
* @class Player
* @constructor
* @param {String} name - the name of the player
* @param {Object} attributes - all designer defined attributes for the player
* @param {Object} zones - object of associated zones referencing tags given in playerTemplate
* @param {Boolean} isAI - an indicator for the AI to tell whether or not the AI should be taking moves or allowing the player to do so
* @param {Boolean} isAClone - a boolean used to determine if a player needs a new ID
*/
function Player(name, attributes, zones, isAI, isAClone, actions)
{
	//Only get new ID if not cloning the card
	if (isAClone !== true)
	{
		this.id = getNewPlayerID();
	}
	this.name = name;
	this.attributes = attributes;
	this.zones = zones;
	this.isAI = isAI;
	this.actions = actions;
}
/**
* Determines whether the player controls the given zone
* @method Player.prototype.controlsZone
* @param {String} zoneName - the name of the zone being checked
* @return {Boolean} Returns whether or not the given zone can be acted upon by the player
*/
Player.prototype.controlsZone = function(zoneName)
{
	for (var zone in this.zones)
	{
		if(this.zones[zone] === zoneName)
		{
			return true;
		}
	}
	return false;
};
/**
* Creates a clone of the player
* @method Player.prototype.clone
* @return {Player} Returns a copy of the player
*/
Player.prototype.clone = function() {
	var playerClone = new Player(
		this.name,
		objectClone(this.attributes),
		objectClone(this.zones),
		this.isAI,
		true,
		objectClone(this.actions)); 
	playerClone.id = this.id;
	return playerClone;
};