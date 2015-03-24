/**
* A namespace for fundamental gamestate manipulations
*
* @class Event
*/
var Event = {
	Move: {
		Individual: {
			/**
			* Moves the given card to the given zone
			* @method Event.Move.Individual.toZone
			* @param {Int} cardID - the unique identification number of the card being moved
			* @param {String} zoneName - the name of the zone to which the card is being moved to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			toZone: function(cardID, zoneName, gamestate)
			{
				/*should this be card or cardID????????????*/
				var card = lookupCard(cardID, gamestate);
				var zone = lookupZone(zoneName, gamestate);
				var prevOwner = lookupZone(card.zone, gamestate);
				if (prevOwner)
				{
					for (var i = 0; i < prevOwner.cards.length; i++)
					{
						if (prevOwner.cards[i] === card.id)
						{
							prevOwner.cards.splice(i, 1);
						}
					};
				};
				zone.cards.push(card.id);
				card.zone = zone.name;
				gameLog("	Moved card: " + card.name + " (Id: " + card.id + ") from zone: " + prevOwner.name + " to zone: " + zone.name + ".");
			},
			fromIndexOfZoneToZone: function(index, fromZone, toZone){}
		},
		Group: {
			/**
			* Move all cards from the given zone to the other given zone
			* @method Event.Move.Group.moveAll
			* @param {String} fromZone - the name of the zone from which the card(s) are being moved from
			* @param {String} toZone - the name of the zone to which the card(s) are being moved to
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			moveAll: function(fromZone, toZone, gamestate)
			{
				var from = lookupZone(fromZone, gamestate);
				var to = lookupZone(toZone, gamestate);
				for(var i = 0; i < from.cards.length; i +=1)
				{
					Event.moveCardToZone(from.cards[0], to, gs);
				}
			},
			/**
			* Move all cards with the given card type name from the given zone to the other given zone
			* @method Event.Move.Group.moveAllOfType
			* @param {String} fromZone - the name of the zone from which the card(s) are being moved from
			* @param {String} toZone - the name of the zone to which the card(s) are being moved to
			* @param {String} cardType - the name of the card type to be moved
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			moveAllOfType: function(fromZone, toZone, cardType, gamestate)
			{
				var from = lookupZone(fromZone, gamestate);
				var to = lookupZone(toZone, gamestate);
				/*for(var i = to.length - 1; i >= 0; i -= 1)
				{
					if(from.cards[i].name === cardTypeName)
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
				}*/
				var i = 0;
				while(i < from.length)
				{
					if(from.cards[i].name === cardTypeName)
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
					else
					{
						i += 1;
					}
				}
			},
			/**
			* Move all cards with the given attribute value from the given zone to the other given zone
			* @method Event.Move.Group.moveAllWithAttributeValue
			* @param {String} fromZone - the name of the zone from which the card(s) are being moved from
			* @param {String} toZone - the name of the zone to which the card(s) are being moved to
			* @param {String} attributeName - the name of the attribute whose value is being checked
			* @param {String} attributeName - the value of the attribute to be checked against
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			moveAllWithAttributeValue: function(fromZone, toZone, attributeName, attributeValue, gamestate)
			{
				var from = lookupZone(fromZone, gamestate);
				var to = lookupZone(toZone, gamestate);
				/*for(var i = to.length - 1; i >= 0; i -= 1)
				{
					if(from.cards[i][attributeName] === attributeValue))
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
				}*/
				var i = 0;
				while(i < from.length)
				{
					if(from.cards[i][attributeName] === attributeValue)
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
					else
					{
						i += 1;
					}
				}
			},
			/**
			* Move all cards that meet the requirement function's condition for movement from the given zone to the other given zone
			* @method Event.Move.Group.moveAllValid
			* @param {String} fromZone - the name of the zone from which the card(s) are being moved from
			* @param {String} toZone - the name of the zone to which the card(s) are being moved to
			* @param {Function} isValid - a function that takes a card and returns either true or false, if true is returned, the card is moved
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			moveAllValid: function(fromZone, toZone, isValid, gamestate)
			{
				var from = lookupZone(fromZone, gamestate);
				var to = lookupZone(toZone, gamestate);
				/*for(var i = to.length - 1; i >= 0; i -= 1)
				{
					if(isValid(from.cards[i]))
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
				}*/
				var i = 0;
				while(i < from.length)
				{
					if(isValid(from.cards[i]))
					{
						Event.moveCardToZone(from.cards[i], to, gamestate);
					}
					else
					{
						i += 1;
					}
				}
			}
		}
	},
	Draw: {
		/**
		* Moves the top card from one zone to another
		* @method Event.Draw.drawCard
		* @param {String} fromZone - the zone from which a card is being drawn
		* @param {String} toZone - the zone from which a card is being drawn
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		drawCard: function(fromZone, toZone, gamestate)
		{
			Event.Move.Individual.toZone(lookupZone(fromZone, gamestate).cards[0], toZone, gamestate);
		},
		/**
		* Moves the top n cards from one zone to another
		* @method Event.Draw.drawCards
		* @param {String} fromZone - the zone from which a card is being drawn
		* @param {String} toZone - the zone from which a card is being drawn
		* @param {int} toDraw - the number of cards to be drawn
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		drawCards: function(fromZone, toZone, toDraw, gamestate)
		{
			for(var i = 0; i < toDraw; i += 1)
			{
				Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0], toZone, gamestate);
			}
		}
	},
	Shuffle: {
		/**
		* Shuffles the cards in the named zone
		* @method Event.Shuffle.shuffle
		* @param {String} zoneName - the name of the zone to be shuffled 
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
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
		}
	},
	Deal: {
		/**
		* Deals the specified number of cards from the given zone to each specified zone
		* @method Event.Deal.dealCards
		* @param {String} fromZone - the zone from which cards are being dealt
		* @param {Array of String} toZoneNameArray - an array of zone names to which cards are being dealt
		* @param {int} numCards - the number of cards to be dealt to each player
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
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
		}
	},
	Modify: {
		Card:{
			/**
			* Sets the named card's named attribute by the given value
			* @method Event.Modify.Card.setAttribute
			* @param {Int} cardID - the name of the card whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {Object} newValue - the new value being given to the object's attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			setAttribute: function (cardID, attributeName, newValue, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				card.attributes[attributeName] = newValue;
			},
			/**
			* Increases the named card's named attribute by the given value
			* @method Event.Modify.Card.increaseAttributeBy
			* @param {Int} cardID - the name of the card whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to increase the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			increaseAttributeBy: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				Event.Modify.Card.setAttribute(cardID, attributeName, card.attributes[attributeName] + value, gamestate);
			},
			/**
			* Decreases the named card's named attribute by the given value
			* @method Event.Modify.Card.decreaseAttributeBy
			* @param {Int} cardID - the name of the card whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to decrease the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			decreaseAttributeBy: function(cardID, attributeName, value, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				Event.Modify.Card.setAttribute(cardID, attributeName, card.attributes[attributeName] - value, gamestate);
			},
			applyModification: function(cardID, modificationFunction, gamestate)
			{
				var card = lookupCard(cardID, gamestate);
				modificationFunction(card);
			},
			applyModificationToZoneCards: function(zoneName, modificationFunction, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				for(var i = 0; i < zone.cards.length; i += 1)
				{
					modificationFunction(zone.cards[i]);
				}
			},
			applyModificationToAllCardsInUniverse: function()
			{

			},
			applyModificationToAllCardsOfType: function()
			{

			},
			applyModificationToAllValidZoneCards: function(zoneName, modificationFunction, isValidFunction, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				for(var i = 0; i < zone.cards.length; i += 1)
				{
					if(isValid(zone.cards[i]))
					{
						modificationFunction(zone.cards[i]);
					}
				}
			}
		},
		Player: {
			/**
			* Sets the named player's named attribute by the given value
			* @method Event.Modify.Card.setAttribute
			* @param {String} playerName - the name of the player whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {Object} newValue - the new value being given to the object's attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			setAttribute: function (playerName, attributeName, newValue, gamestate)
			{
				var player = lookupPlayer(playerName, gamestate);
				player.attributes[attributeName] = newValue;
			},
			/**
			* Increases the named player's named attribute by the given value
			* @method Event.Modify.Player.increaseAttributeBy
			* @param {String} playerName - the name of the player whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to increase the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			increaseAttributeBy: function(playerName, attributeName, value, gamestate)
			{
				Event.Modify.Player.setAttribute(playerName, attributeName, playerName.attributes[attributeName] + value, gamestate);
			},
			/**
			* Decreases the named player's named attribute by the given value
			* @method Event.Modify.Player.decreaseAttributeBy
			* @param {String} playerName - the name of the player whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to decrease the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			decreaseAttributeBy: function(playerName, attributeName, value, gamestate)
			{
				Event.Modify.Player.setAttribute(playerName, attributeName, playerName.attributes[attributeName] - value, gamestate);
			}
		},
		Zone: {
			/**
			* Sets the named zone's named attribute by the given value
			* @method Event.Modify.Zone.setAttribute
			* @param {String} zoneName - the name of the zone whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {Object} newValue - the new value being given to the object's attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			setAttribute: function (zoneName, attributeName, newValue, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				zone.attributes[attributeName] = newValue;
			},
			/**
			* Increases the named zone's named attribute by the given value
			* @method Event.Modify.Zone.increaseAttributeBy
			* @param {String} zoneName - the name of the zone whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to increase the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			increaseAttributeBy: function(zoneName, attributeName, value, gamestate)
			{
				Event.Modify.zone.setAttribute(zoneName, attributeName, zoneName.attributes[attributeName] + value, gamestate);
			},
			/**
			* Decreases the named zone's named attribute by the given value
			* @method Event.Modify.Zone.decreaseAttributeBy
			* @param {String} zoneName - the name of the zone whose attribute value is being changed
			* @param {String} attributeName - the name of the attribute to be changed
			* @param {number} value - the value by which to decrease the attribute
			* @param {GameState} gamestate - the gamestate in which this event is taking place
			*/
			decreaseAttributeBy: function(zoneName, attributeName, value, gamestate)
			{
				Event.Modify.Player.setAttribute(zoneName, attributeName, zoneName.attributes[attributeName] - value, gamestate);
			}
		},
		/**
		* Ends the current phase continues to the next one, if the current phase is the final phase in the game's turn structure, the end turn event is called
		* @method Event.Modify.endPhase
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		endPhase: function (gamestate)
		{
			gameLog("End phase \"" + gamestate.currentPhase + "\".");
			var index = gameDescription.phases.indexOf(lookupPhase(gamestate.currentPhase, gameDescription));
			index ++;
			if (index >= gameDescription.phases.length)
			{
				index = 0;
				Event.Modify.endTurn(gamestate);
				gamestate.currentPhase = gameDescription.phases[0].name;
			}
			else
			{
				gamestate.currentPhase = gameDescription.phases[index].name;
			}
			gameLog("Begin phase \"" + gamestate.currentPhase + "\".");
			//Run initial function for phase
			window[lookupPhase(gamestate.currentPhase, gameDescription).init].apply(this, [gamestate]);
		},
		/**
		* Ends the current turn and allows the next player in the turn structure to begin their turn.
		* @method Event.Modify.endTurn
		* @param {GameState} gamestate - the gamestate in which this event is taking place
		*/
		endTurn: function (gamestate)
		{
			var player = lookupPlayer(gamestate.turnPlayer, gamestate);
			gameLog("End of " + player.name + "'s turn.");
			var index = gamestate.players.indexOf(player);
			index ++;
			if (index >= gamestate.players.length)
			{
				index = 0;
			}
			gamestate.turnPlayer = gamestate.players[index].name;

			gameLog("Begin " + gamestate.turnPlayer + "'s turn.");

			player = lookupPlayer(gamestate.turnPlayer, gamestate)
			//Run AI if it is AI's turn
			if (player.isAI && !currentlySimulating)
			{
				run_current_ai(player.name, gamestate, gameDescription, MAX_CONSEC_TURNS);
			}
		}
	}
};
