/*Zone: a place that contains cards*/
function Zone(name, attributes, type, visibleTo)
{
	this.name = name;
	this.attributes = attributes;
	this.cards = [];
	this.type = type;
	this.visibleTo = visibleTo;
}

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