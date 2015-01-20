/*Zone: a place that contains cards*/
function Zone(name, attributes, type, visibleTo)
{
	this.name = name;
	this.attributes = attributes;
	this.cards = [];
	this.type = type;
	this.visibleTo = visibleTo;
}