/*Card: an instance of a card type (card in database of cards for given game)*/
function Card(name, zone, attributes, actions)
{
	this.id = getNewCardID();
	this.zone = zone;
	this.name = name;
	this.attributes = attributes;
	this.actions = actions;
}

Card.prototype.isVisibleTo = function(playerName, gs) {
	var cardZone = lookupZone(this.zone, gs);
	return cardZone.isVisibleTo(playerName);
};