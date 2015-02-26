/*API Naming Convention and Structure*/
/**
* A namespace for second order functions
*
* @class API
*/
var API = {
	CardCounting: {
		/**
		* Returns the number of cards in a given zone
		* @method API.CardCounting.inZone
		* @param {String} zoneName - the name of the zone whose cards are being counted
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		inZone: function(zoneName, gamestate)
		{
			var zone = lookupZone(zoneName, gamestate);
			return zone.cards.length;
		},
		/**
		* Returns the number of cards of the named type in a given zone
		* @method API.CardCounting.ofTypeInZone
		* @param {String} zoneName - the name of the zone whose cards are being counted
		* @param {String} cardType - the name of the card type being counted in a given zone
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		ofTypeInZone: function(zoneName, cardTypeName, gamestate)
		{
			var cards = lookupZone(zoneName, gamestate).cards;
			var count = 0;
			for(var i = 0; i < cards.length; i += 1)
			{
				if(cards[i].name === cardTypeName)
				{
					count += 1;
				}
			}
			return count;
		},
		/**
		* Returns the number of cards that meet requirement function's condition in a given zone
		* @method API.CardCounting.ofTypeInZone
		* @param {String} zoneName - the name of the zone whose cards are being counted
		* @param {Function} isValid - a function that takes a card and returns either true or false, if true is returned, the card is counted
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		validInZone: function(zoneName, isValid, gamestate)
		{
			var cards = lookupZone(zoneName, gamestate).cards;
			var count = 0;
			for(var i = 0; i < cards.length; i += 1)
			{
				if(isValid(cards[i]) === true)
				{
					count += 1;
				}
			}
			return count;
		}
	},
	CardLookup: {
		cardIndexInZone: function()
		{
			console.log("TO CODE: API.CardLookup.cardIndexInZone");
		}
	},
	ValueComparison: {
		/**
		* Returns if the given object's named attribute's value is greater than a given value
		* @method API.ValueComparison.isAttributeGreaterThan
		* @param {Object} obj - the object whose attribute's value is being checked
		* @param {String} attributeName - the name of the 
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		isAttributeGreaterThan: function(obj, attributeName, value)
		{
			if(obj.attributes[attributeName] > value)
			{
				return true;
			}
			return false;
		},
		isAttributeLessThan: function(obj, attributeName, value)
		{
			if(obj.attributes[attributeName] < value)
			{
				return true;
			}
			return false;
		},
		isAttributeEqualTo: function(obj, attributeName, value)
		{
			if(obj.attributes[attributeName] === value)
			{
				return true;
			}
			return false;
		}
	},
	DieRolling: {
		rollDie: function(numSides)
		{
			return Math.floor(Math.random() * numSides) + 1;
		},
		rollNDie: function(numSides, toRoll)
		{
			var results = [];
			for(var i = 0; i < toRoll; i += 1)
			{
				results.push(Math.floor(Math.random() * numSides) + 1);
			}
			return results;
		},
		rollDieSum: function(numSides, toRoll)
		{
			var results = 0;
			for(var i = 0; i < toRoll; i += 1)
			{
				results += Math.floor(Math.random() * numSides) + 1;
			}
			return results;
		},
		rollSpecialDie: function(values)
		{
			return values[Math.floor(Math.random() * values.length - 1) + 1];
		},
		rollNSpecialDie: function (values, toRoll)
		{
			var results = [];
			for(var i = 0; i < toRoll; i += 1)
			{
				results.push(values[Math.floor(Math.random() * values.length - 1) + 1]);
			}
			return results;
		}
	},
	Manipulations: {
		shuffle: function(zoneName, gamestate)
		{
			/*Fisher-Yates Shuffle*/
			var deck = lookupZone(zoneName, gamestate).cards;
			var currentIndex = deck.length;
			var tempVal;
			var randomIndex;
			while(0 != currentIndex)
			{
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				tempVal = deck[currentIndex];
				deck[currentIndex] = deck[randomIndex];
				deck[randomIndex] = tempVal;
			}
		},
		dealCards: function (fromZone, toZoneNameArray, numCards, gamestate)
		{
			var from = lookupZone(fromZone, gamestate);
			for(var i = 0; i < numCards; i += 1)
			{
				for(var j = 0; j < toZoneArray.length; j +=1)
				{
					var toZone = lookupZone(toZoneNameArray[i], gamestate);
					Event.moveCardToZone(from.cards[0], toZone, gamestate);
				}
			}
		},
		cut: function (zoneName, gamestate)
		{
			var deck = lookupZone(zoneName, gamestate).cards;
			return deck[Math.floor(Math.random() * deck.length)];
		}
	},
	Sorting: {
		Player_Sorting: {
			sortPlayerByAttributeValue: function(attributeName)
			{
				console.log("TO CODE: API.Sorting.Player_Sorting.sortPlayerByAttributeValue");
			},
			sortPlayerByFunc: function(func)
			{
				console.log("TO CODE: API.Sorting.Player_Sorting.cardIndexInZone");
			}
		},
		Card_Sorting: {
			byCardType: function (zoneName, gamestate)
			{
				console.log("TO CODE: API.Sorting.Card_Sorting.byCardType");
			},
			byCardAttributeValue: function (zoneName, attributeName, attributeValue, gamestate)
			{
				console.log("TO CODE: API.Sorting.Card_Sorting.byCardAttributeValue");
			},
			byCardValid: function(zoneName, isValid, gamestate)
			{
				console.log("TO CODE: API.Sorting.Card_Sorting.byCardValid");
			}
		}
	}
};