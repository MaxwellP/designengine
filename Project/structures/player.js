/*Player: a place that contains cards*/
function Player(name, attributes, zones)
{
	this.id = getNewPlayerID();
	this.name = name;
	this.attributes = attributes;
	this.zones = zones;
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