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
	endPhase: function (gs, gd)
	{
		var index = gd.phases.indexOf(lookupPhase(gs.currentPhase, gd));
		index ++;
		if (index >= gd.phases.length)
		{
			index = 0;
			Event.endTurn(gs, gd);
			gs.currentPhase = gd.phases[0].name;
		}
		else
		{
			gs.currentPhase = gd.phases[index].name;
		}
		//Run initial function for phase
		window[lookupPhase(gs.currentPhase, gd).init].apply(this, [gs]);


		
	},
	endTurn: function (gs, gd)
	{
		var player = lookupPlayer(gs.turnPlayer, gs)
		var index = gs.players.indexOf(player);
		index ++;
		if (index >= gs.players.length)
		{
			index = 0;
		}
		gs.turnPlayer = gs.players[index].name;


		player = lookupPlayer(gs.turnPlayer, gs)
		//Run AI if it is AI's turn
		if (player.isAI)
		{
			runAI(player, gs, gd, 10);
		}
	}
};