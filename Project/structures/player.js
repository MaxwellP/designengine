/*Player: a place that contains cards*/
function Player(id, name, attributes, attributes, zones)
{
	this.id = getNewPlayerID();
	this.name = name;
	this.attributes = attributes;
	this.zones = zones;
}