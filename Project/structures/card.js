/**
* An instance of a card type
*
* @class Card
* @constructor
* @param {Int} id - a unique ID for this card
* @param {Zone} zone - the name of the zone that the card currently resides in
* @param {String} name - the name of the card type that this card is an instance of
* @param {Object} attributes - an object containing all attributes for this card
* @param {Array} actions - an array of all actions the card has
*/
function Card(name, zone, attributes, actions)
{
	this.id = getNewCardID();
	this.zone = zone;
	this.name = name;
	this.attributes = attributes;
	this.actions = actions;
}
/**
* @method Card.prototype.isVisibleTo
* @param {String} playerName - the player who's ability to view the card is being questioned
* @param {GameState} gs - the gamestate over which the query is taking place
* @return {Boolean} Returns true if the given player can view the card
*/
Card.prototype.isVisibleTo = function(playerName, gs) {
	var cardZone = lookupZone(this.zone, gs);
	return cardZone.isVisibleTo(playerName);
};