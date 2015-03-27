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
		/**
		* Returns the zone name the card is currently in
		* @method API.CardLookup.cardInZone
		* @param {Int} cardID - the name of the card whose attribute's value is being checked
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		cardInZone: function(cardID, gamestate)
		{
			var card = lookupCard(cardID, gamestate);
			return card.zone;
		},
		/**
		* Returns if the card is currently in the given zone
		* @method API.CardLookup.cardInZone
		* @param {Int} cardID - the name of the card whose attribute's value is being checked
		* @param {String} zoneName - the name of the zone to check if the card is in
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		isCardInZone: function(cardID, zoneName, gamestate)
		{
			var gotZone = API.CardLookup.cardInZone(cardID, gamestate);
			return (gotZone === zoneName);
		},
		/**
		* Returns the cardID of the first card in a zone
		* @method API.CardLookup.firstCardInZone
		* @param {String} zoneName - the name of the zone to get the first card from
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		firstCardInZone: function(zoneName, gamestate)
		{
			var zone = lookupZone(zoneName, gamestate);
			if (zone.cards.length === 0)
			{
				//No cards in the zone
				return false;
			}
			else
			{
				//First card in the zone
				return zone.cards[0];
			}
		},
		/**
		* Returns the cardID of the last card in a zone
		* @method API.CardLookup.firstCardInZone
		* @param {String} zoneName - the name of the zone to get the last card from
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		lastCardInZone: function(zoneName, gamestate)
		{
			var zone = lookupZone(zoneName, gamestate);
			if (zone.cards.length === 0)
			{
				//No cards in the zone
				return false;
			}
			else
			{
				//Last card in the zone
				return zone.cards[zone.cards.length - 1];
			}
		},
		/**
		* Returns an array containing all the cardIDs of the cards in a zone
		* @method API.CardLookup.allCardsInZone
		* @param {String} zoneName - the name of the zone to get the cards from
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		allCardsInZone: function(zoneName, gamestate)
		{
			var zone = lookupZone(zoneName, gamestate);
			return objectClone(zone.cards);
		},
		cardIndexInZone: function(cardID, zoneName, gamestate)
		{
			var zone = lookupZone(zoneName, gamestate);
			for(var i = 0; i < zone.cards.length; i += 1)
			{
				if(cardID === zone.cards[i])
				{
					return i;
				}
			}
			return false;
		}
	},
	ZoneLookup: {
		/**
		* Returns the name of a player's zone with the given tag 
		* @method API.ZoneLookup.getZoneByTag
		* @param {String} playerName - the name of the player to get the associated tagged zone from
		* @param {String} zoneTag - the name of the tag to look up
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		getZoneByTag: function(playerName, zoneTag, gamestate)
		{
			var player = lookupPlayer(playerName, gamestate);
			return player.zones[zoneTag];
		},
		/**
		* Returns the name of the opponent player's zone with the given tag 
		* @method API.ZoneLookup.getEnemyZoneByTag
		* @param {String} playerName - the name of the player whose enemy to get the associated tagged zone from
		* @param {String} zoneTag - the name of the tag to look up
		* @param {GameState} gamestate - the gamestate in which this call is taking place
		*/
		getEnemyZoneByTag: function(playerName, zoneTag, gamestate)
		{
			var enemy = getAltPlayer(playerName, gamestate);
			return enemy.zones[zoneTag];
		}
	},
	ValueLookup: {
		Card: {
			/**
			* Returns the given card's value for the given named attribute
			* @method API.ValueLookup.Card.getAttribute
			* @param {Int} cardID - the id of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute to get the value of
			* @param {GameState} gamestate - the gamestate to get data from
			*/
			getAttribute: function (cardID, attributeName, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				return card.attributes[attributeName];
			}
		},
		Player: {
			/**
			* Returns the current player
			* @method API.ValueLookup.Player.currentPlayer
			* @param {GameState} gamestate - the gamestate to get data from
			*/
			currentPlayer: function (gamestate)
			{
				return gamestate.turnPlayer;
			},
			/**
			* Returns the enemy player
			* @method API.ValueLookup.Player.enemyPlayer
			* @param {GameState} gamestate - the gamestate to get data from
			*/
			enemyPlayer: function (gamestate)
			{
				return getAltPlayer(gamestate.turnPlayer, gamestate).name;
			}
		}
	},
	ValueComparison: {
		Card: {
			/**
			* Returns if the given card's named attribute's value is greater than the given value
			* @method API.ValueComparison.Card.isAttributeGreaterThan
			* @param {Int} cardID - the name of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the card's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThan: function(cardID, attributeName, value, gamestate)
			{
				debugger;
				var card = lookupCard(cardID, gamestate);
				if(card.attributes[attributeName] > value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given card's named attribute's value is less than the given value
			* @method API.ValueComparison.Card.isAttributeLessThan
			* @param {Int} cardID - the name of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the card's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThan: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				if(card.attributes[attributeName] < value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given card's named attribute's value is equal to the given value
			* @method API.ValueComparison.Card.isAttributeEqualTo
			* @param {Int} cardID - the name of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the card's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeEqualTo: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				if(card.attributes[attributeName] === value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given card's named attribute's value is less than or equal to the given value
			* @method API.ValueComparison.Card.isAttributeLessThanOrEqualTo
			* @param {Int} cardID - the name of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the card's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThanOrEqualTo: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				if(card.attributes[attributeName] <= value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given card's named attribute's value is greater than or equal to the given value
			* @method API.ValueComparison.Card.isAttributeGreaterThanOrEqualTo
			* @param {Int} cardID - the name of the card whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the card's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThanOrEqualTo: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				if(card.attributes[attributeName] >= value)
				{
					return true;
				}
				return false;
			}
		},
		Player: {
			/**
			* Returns if the given player's named attribute's value is greater than the given value
			* @method API.ValueComparison.Player.isAttributeGreaterThan
			* @param {String} playerName - the name of the player whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the player's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThan: function(playerName, attributeName, value, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				if(player.attributes[attributeName] > value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given player's named attribute's value is less than the given value
			* @method API.ValueComparison.Player.isAttributeLessThan
			* @param {String} playerName - the name of the player whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the player's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThan: function(playerName, attributeName, value, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				if(player.attributes[attributeName] < value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given player's named attribute's value is equal to the given value
			* @method API.ValueComparison.Player.isAttributeEqualTo
			* @param {String} playerName - the name of the player whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the player's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeEqualTo: function(playerName, attributeName, value, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				if(player.attributes[attributeName] === value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given player's named attribute's value is less than or equal to the given value
			* @method API.ValueComparison.Player.isAttributeLessThanOrEqualTo
			* @param {String} playerName - the name of the player whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the player's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThanOrEqualTo: function(playerName, attributeName, value, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				if(player.attributes[attributeName] <= value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given player's named attribute's value is greater than or equal to the given value
			* @method API.ValueComparison.Player.isAttributeGreaterThanOrEqualTo
			* @param {String} playerName - the name of the player whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the player's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThanOrEqualTo: function(playerName, attributeName, value, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				if(player.attributes[attributeName] >= value)
				{
					return true;
				}
				return false;
			}
		},
		Zone: {
			/**
			* Returns if the given zone's named attribute's value is greater than the given value
			* @method API.ValueComparison.Zone.isAttributeGreaterThan
			* @param {String} zoneName - the name of the zone whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the zone's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThan: function(zoneName, attributeName, value, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				if(zone.attributes[attributeName] > value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given zone's named attribute's value is less than the given value
			* @method API.ValueComparison.Zone.isAttributeLessThan
			* @param {String} zoneName - the name of the zone whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the zone's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThan: function(zoneName, attributeName, value, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				if(zone.attributes[attributeName] < value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given zone's named attribute's value is equal to the given value
			* @method API.ValueComparison.Zone.isAttributeEqualTo
			* @param {String} zoneName - the name of the zone whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the zone's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeEqualTo: function(zoneName, attributeName, value, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				if(zone.attributes[attributeName] === value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given zone's named attribute's value is less than or equal to the given value
			* @method API.ValueComparison.Zone.isAttributeLessThanOrEqualTo
			* @param {String} zoneName - the name of the zone whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the zone's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeLessThanOrEqualTo: function(zoneName, attributeName, value, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				if(zone.attributes[attributeName] <= value)
				{
					return true;
				}
				return false;
			},
			/**
			* Returns if the given zone's named attribute's value is greater than or equal to the given value
			* @method API.ValueComparison.Zone.isAttributeGreaterThanOrEqualTo
			* @param {String} zoneName - the name of the zone whose attribute's value is being checked
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {number} value - the value to compare the zone's value to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			isAttributeGreaterThanOrEqualTo: function(zoneName, attributeName, value, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				if(zone.attributes[attributeName] >= value)
				{
					return true;
				}
				return false;
			}
		}
		/*
			ADD LESS THAN OR EQUAL
			ADD GREATER THAN OR EQUAL
			ADD NOT EQUAL
		*/
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
	},
	Phase: {
		/**
		* Returns the name of the current phase
		* @method API.Phase.getPhase
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		getPhase: function(gamestate)
		{
			return gamestate.currentPhase;
		},
		/**
		* Returns if the current phase is the given phase
		* @method API.Phase.checkPhase
		* @param {GameState} phaseName - the name of the phase to check against
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		checkPhase: function(phaseName, gamestate)
		{
			return (gamestate.currentPhase === phaseName);
		}
	}
};