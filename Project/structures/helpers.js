
//Determines the next ID number
var cardIDCounter = 0;
function getNewCardID () {
	return cardIDCounter ++;
}

//Determines the next ID number
var playerIDCounter = 0;
function getNewPlayerID () {
	return playerIDCounter ++;
}

function lookupZoneByParam(parameterArray, valueArray, gs)
{
	for (var i = 0; i < gs.zones.length; i++) {
		var correctZone = true;
		for (var j = 0; j < parameterArray.length; j++) {
			if (gs.zones[i][parameterArray[j]] != valueArray[j])
			{
				correctZone = false;
			}
		};
		if (correctZone)
		{
			return gs.zones[i];
		}
	};
	return false;
};

function lookupZone (name, gs) {
	for (var i = 0; i < gs.zones.length; i++) {
		if (gs.zones[i].name == name)
		{
			return gs.zones[i];
		}
	}
	console.log("Could not find zone with name \"" + name + "\".");
	throw new Error("Zone Lookup Error");
	return false;
}

function lookupCardType(name, gd)
{
	for(var i = 0; i < gd.cardTypes.length; i += 1)
	{
		if (gd.cardTypes[i].name == name)
		{
			return gd.cardTypes[i];
		}
	}
	console.log("Could not find cardType with name \"" + name + "\".");
	return false;
};

function lookupActionTemplate (name, gd)
{
	for (var i = 0; i < gd.actionTemplates.length; i++)
	{
		if (gd.actionTemplates[i].name == name)
		{
			return gd.actionTemplates[i];
		}
	}
	console.log("No template named \"" + name + "\" exists");
	return false;
}

function lookupPhase (name, gd)
{
	for (var i = 0; i < gd.phases.length; i++)
	{
		if (gd.phases[i].name == name)
		{
			return gd.phases[i];
		}
	}
	console.log("No phase named \"" + name + "\" exists");
	throw new Error("Phase Lookup Error");
	return false;
}

function getZoneNameArray (gs)
{
	var zoneNames = [];
	for (var i = 0; i < gs.zones.length; i++)
	{
		zoneNames.push(gs.zones[i].name);
	}
	return zoneNames;
}

function getPlayerNameArray (gs)
{
	var playerNames = [];
	for (var i = 0; i < gs.players.length; i++)
	{
		playerNames.push(gs.players[i].name);
	}
	return playerNames;
}

function getCardIDArray (gs)
{
	var cardIDs = [];
	for (var i = 0; i < gs.cards.length; i++)
	{
		cardIDs.push(gs.cards[i].id);
	}
	return cardIDs;
}

function lookupCard(id, gs) {
	//Experimental version:
	//return gs.cards[id];

	//Reliable version
	for(var i = 0; i < gs.cards.length; i += 1)
	{
		if (gs.cards[i].id == id)
		{
			return gs.cards[i];
		}
	}
	console.log("Could not find card with id \"" + id + "\".");
	return false;
}

function lookupPlayer (name, gs) {
	for (var i = 0; i < gs.players.length; i++) {
		if (gs.players[i].name == name)
		{
			return gs.players[i];
		}
	};

	console.log("No player named \"" + name + "\" exists");
	throw new Error("Player Lookup Error");
	return false;
}

//Using a function found from:
//http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
//(Second answer, from ckozl)
function cartProd() {
	var args = [].slice.call(arguments);

	var end  = args.length - 1;
	var result = []
	function addTo(curr, start) {
		var first = args[start];
		var last = (start === end);
		for (var i = 0; i < first.length; ++i) {
			var copy = curr.slice();
			copy.push(first[i]);
			if (last)
			{
				result.push(copy);
			}
			else
			{
				addTo(copy, start + 1);
			}
		}
	}
	if (args.length)
	{
		addTo([], 0);
	}
	else
	{
		result.push([]);
	}
	return result;
}

//Object clone function
function objectClone (oldObject) 
{
	return JSON.parse(JSON.stringify(oldObject));
};