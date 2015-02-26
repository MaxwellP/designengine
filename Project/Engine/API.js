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
		* Returns if the given object's named attribute's value is greater than the given value
		* @method API.ValueComparison.isAttributeGreaterThan
		* @param {Object} obj - the object whose attribute's value is being checked
		* @param {String} attributeName - the name of the attribute whose value is being checked
		* @param {number} value - the value to compare the object's value to
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
		/**
		* Returns if the given object's named attribute's value is less than the given value
		* @method API.ValueComparison.isAttributeLessThan
		* @param {Object} obj - the object whose attribute's value is being checked
		* @param {String} attributeName - the name of the attribute whose value is being checked
		* @param {number} value - the value to compare the object's value to
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		isAttributeLessThan: function(obj, attributeName, value)
		{
			if(obj.attributes[attributeName] < value)
			{
				return true;
			}
			return false;
		},
		/**
		* Returns if the given object's named attribute's value is equal to the given value
		* @method API.ValueComparison.isAttributeEqualTo
		* @param {Object} obj - the object whose attribute's value is being checked
		* @param {String} attributeName - the name of the attribute whose value is being checked
		* @param {number} value - the value to compare the object's value to
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
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
		/**
		* Rolls a die with the given number of sides and returns the outcome
		* @method API.DieRolling.rollDie
		* @param {int} numSides - the number of sides the virtual die has
		*/
		rollDie: function(numSides)
		{
			return Math.floor(Math.random() * numSides) + 1;
		},
		/**
		* Rolls a number of die equal to given number, each with the given number of sides, it returns an array of integer outcomes
		* @method API.DieRolling.rollNDie
		* @param {int} numSides - the number of sides the virtual die has
		* @param {int} toRoll - the number of die to roll
		*/
		rollNDie: function(numSides, toRoll)
		{
			var results = [];
			for(var i = 0; i < toRoll; i += 1)
			{
				results.push(Math.floor(Math.random() * numSides) + 1);
			}
			return results;
		},
		/**
		* Rolls a number of die equal to given number, each with the given number of sides, it returns the sum of the die rolls
		* @method API.DieRolling.rollNDieSum
		* @param {int} numSides - the number of sides the virtual die has
		* @param {int} toRoll - the number of die to roll
		*/
		rollNDieSum: function(numSides, toRoll)
		{
			var results = 0;
			for(var i = 0; i < toRoll; i += 1)
			{
				results += Math.floor(Math.random() * numSides) + 1;
			}
			return results;
		},
		/**
		* Rolls a die with the given array's values as sides of the die, and returns the outcome
		* @method API.DieRolling.rollSpecialDie
		* @param {Array of Object} values - an array of objects (the sides of the die)
		*/
		rollSpecialDie: function(values)
		{
			return values[Math.floor(Math.random() * values.length - 1) + 1];
		},
		/**
		* Rolls a number of die equal to given number, each with the given array's values as sides of the die, and returns the outcome as an array
		* @method API.DieRolling.rollNSpecialDie
		* @param {Array of Object} values - an array of objects (the sides of the die)
		* @param {int} toRoll - the number of die to roll
		*/
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
		/**
		* "Cuts" the named zone's cards and returns the revealed card
		* @method API.Manipulations.cut
		* @param {Zone} zoneName - the zone whose deck is to be cut
		* @param {GameState} gamestate - the game state in which this action is taking place
		*/
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