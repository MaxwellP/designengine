/*Event: a namespace for fundamental gamestate manipulations*/
var Event = {
	moveCardToZone: function(card, zone, gs)
	{
		var prevOwner = lookupZone(["name"], [card.owner], gs);
		if (prevOwner)
		{
			for (var i = 0; i < prevOwner.cards.length; i++) {
				if (prevOwner.cards[i] === card)
				{
					prevOwner.cards.splice(i, 1);
				}
			};
		}
		zone.cards.push(card);
		card.owner = zone.name;
	},
	changeAttribute: function (obj, attributeName, newValue, gs)
	{
		/*do lookup*/
		obj.attributeName = newValue;
	},
	endPhase: function (gs)
	{

	},
	endTurn: function (gs)
	{
		
	}
};