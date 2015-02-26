/**
* Helper functions
* @Class Helpers
*/
//Determines the next ID number
var cardIDCounter = 0;
/**
* Creates a new unique id for cards
* @method getNewCardID
* @return {Int} Returns the newly created id
*/
function getNewCardID () {
	return cardIDCounter ++;
}
/**
* Determines the next ID number for players
* @method getNewPlayerID
* @return {Int} Returns the newly created id
*/
var playerIDCounter = 0;
function getNewPlayerID () {
	return playerIDCounter ++;
}
/**
* Search for a specific by given search parameters
* @method getNewPlayerID
* @param {Array} parameterArray - 
* @param {Array} valueArray - 
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Zone} Returns the zone if found
*/
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
/**
* Search for a specific zone by name
* @method lookupZone
* @param {String} name - the name of the zone being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Zone} Returns the zone if found
*/
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
/**
* Search for a specific card type by name
* @method lookupCardType
* @param {String} name - the name of the card type being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {CardType} Returns the card type if found
*/
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
/**
* Search for a specific action template type by name
* @method lookupActionTemplate
* @param {String} name - the name of the action template being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {ActionTemplate} Returns the action template type if found
*/
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
/**
* Search for a specific phase type by name
* @method lookupActionTemplate
* @param {String} name - the name of the phase being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Phase} Returns the phase type if found
*/
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
/**
* Get the array of all zone names
* @method getZoneNameArray
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Array} Returns a list of all zone names
*/
function getZoneNameArray (gs)
{
	var zoneNames = [];
	for (var i = 0; i < gs.zones.length; i++)
	{
		zoneNames.push(gs.zones[i].name);
	}
	return zoneNames;
}
/**
* Get the array of all player names
* @method getPlayerNameArray
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Array} Returns a list of all player names
*/
function getPlayerNameArray (gs)
{
	var playerNames = [];
	for (var i = 0; i < gs.players.length; i++)
	{
		playerNames.push(gs.players[i].name);
	}
	return playerNames;
}
/**
* Get the array of all card id's
* @method getCardIDArray
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Array} Returns a list of all card id's
*/
function getCardIDArray (gs)
{
	var cardIDs = [];
	for (var i = 0; i < gs.cards.length; i++)
	{
		cardIDs.push(gs.cards[i].id);
	}
	return cardIDs;
}
/**
* Get the card with the given id
* @method getCardIDArray
* @param {Int} id - the id of the card being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Array} Returns the card with the given id
*/
function lookupCard(id, gs) {
	//Experimental version: doesn't work if cards are ever removed
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
	throw new Error("Card Lookup Error");
	return false;
}
/**
* Search for a player by name
* @method lookupPlayer
* @param {String} name - the name of the player being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Player} Returns the player if found
*/
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
/**
* A Cartesian Product function that acts on all given arrays.
* Found here: http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
* @method cartProd
* @param {Arrays} input - any number of arrays to use as input. Separate by commas.
* @return {Array} Returns all possible combinations of elements taking a single element from each array
*/
function cartProd(input) {
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
/**
* Create a clone of a given Javascript object
* @method lookupPlayer
* @param {Object} oldObject - the object to be cloned
* @return {Object} Returns the cloned object
*/
function objectClone (oldObject) 
{
	return JSON.parse(JSON.stringify(oldObject));
}
/**
* Gets the first player with a name other than the given name
* @method getAltPlayer
* @param {String} playerName - the name of the player not being searched for
* @param {Gamestate} gs - the gamestate which is being searched
* @return {Object} Returns the first player with a name not equal to the given one
*/
function getAltPlayer (playerName, gs)
{
	for (var i = 0; i < gs.players.length; i++)
	{
		if (gs.players[i].name != playerName)
		{
			return gs.players[i];
		}
	}

	console.log("No player NOT named \"" + name + "\" exists");
	throw new Error("Alternate Player Lookup Error");
	return false;
}