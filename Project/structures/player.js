/*Player: a place that contains cards*/
function Player(name, attributes, zones, isAI, isAClone)
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
}

Player.prototype.controlsZone = function(zoneName) {
	for (var i = 0; i < this.zones.length; i++) 
	{
		if (this.zones[i] == zoneName)
		{
			return true;
		}
	};
	return false;
};

Player.prototype.clone = function() {
	var playerClone = new Player(this.name, objectClone(this.attributes), objectClone(this.zones), this.isAI, true); 
	playerClone.id = this.id;
	return playerClone;
};