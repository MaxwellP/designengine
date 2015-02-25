/*TODO*/
/*
	.Sorting
		.Player_Sorting:
			.sortPlayerByAttributeValue
			.sortPlayerByFunc(function)
			.sortPlayerByCardsInZone?
		.Zone_Sorting:
		.Card_Sorting:
			.byCardType(zoneName)
			.byCardAttributeValue(zoneName, attributeName, attributeValue)
			.byCardValid
	.CardLookup
		.getIndexOfCardInZone()
	.CardMovement.Individual
		.moveCardFromZoneToZone()
		.moveCardFromIndexOfZoneToZone()
	Should be an event?
	-TakeAnotherTurn(gs)
	-RepeatPhase(phaseName, gs)
		is phaseName even necessary?
	-WinGame(playerName)
	-LoseGame(playerName, gs)
	-EliminatePlayer(playerName, gs)

	/*Working My Through This List*/
	/*Looking for patterns*/
	/*http://www.pagat.com/alpha/*/
*/

/*API Naming Convention and Structure*/
var API = {
	Functions: {
		CardCounting: {
			inZone: function(zoneName, gamestate)
			{
				var zone = lookupZone(zoneName, gamestate);
				return zone.cards.length;
			},
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
		CardDrawing: {
			drawCard: function(fromZone, toZone, gamestate)
			{
				Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0], toZone, gamestate);
			},
			drawCards: function(fromZone, toZone, toDraw, gamestate)
			{
				for(var i = 0; i < toDraw; i += 1)
				{
					Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0], toZone, gamestate);
				}
			}
		},
		CardLookup: {

		},
		CardMovement: {
			Individual: {

			},
			Group: {
				moveAll: function(fromZone, toZone, gamestate)
				{
					var from = lookupZone(fromZone, gamestate);
					var to = lookupZone(toZone, gamestate);
					for(var i = 0; i < from.cards.length; i +=1)
					{
						Event.moveCardToZone(from.cards[0], to, gs);
					}
				},
				moveAllOfType: function(fromZone, toZone, cardTypeName, gamestate)
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
		ValueComparison: {
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
		ValueAssignment: {
			increaseAttributeBy: function(obj, attributeBy, value)
			{
				Event.changeAttribute(obj, attributeName, obj.attributes[attributeName] + value);
			},
			decreaseAttributeBy: function(obj, attributeBy, value)
			{
				Event.changeAttribute(obj, attributeName, obj.attributes[attributeName] - value);
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

			},
			Zone_Sorting: {

			},
			Card_Sorting: {

			}
		}
	},
	Lambda: {
		CardCounting: {
			inZone: function(zoneName, gamestate)
			{
			},
			ofTypeInZone: function(zoneName, cardTypeName, gamestate)
			{
			},
			validInZone: function(zoneName, isValid, gamestate)
			{
			}
		},
		CardDrawing: {
			drawCard: function(fromZone, toZone, gamestate)
			{
			},
			drawCards: function(fromZone, toZone, toDraw, gamestate)
			{
			}
		},
		CardLookup: {

		},
		CardMovement: {
			Individual: {

			},
			Group: {
				moveAll: function(fromZone, toZone, gamestate)
				{
				},
				moveAllOfType: function(fromZone, toZone, cardTypeName, gamestate)
				{
				},
				moveAllWithAttributeValue: function(fromZone, toZone, attributeName, attributeValue, gamestate)
				{
				},
				moveAllValid: function(fromZone, toZone, isValid, gamestate)
				{
				}
			}
		},
		ValueComparison: {
			isAttributeGreaterThan: function(obj, attributeName, value)
			{
			},
			isAttributeLessThan: function(obj, attributeName, value)
			{
			},
			isAttributeEqualTo: function(obj, attributeName, value)
			{
			}
		},
		ValueAssignment: {
			increaseAttributeBy: function(obj, attributeBy, value)
			{
			},
			decreaseAttributeBy: function(obj, attributeBy, value)
			{
			}
		},
		DieRolling: {
			rollDie: function(numSides)
			{
			},
			rollNDie: function(numSides, toRoll)
			{
			},
			rollDieSum: function(numSides, toRoll)
			{
			},
			rollSpecialDie: function(values)
			{
			},
			rollNSpecialDie: function (values, toRoll)
			{
			}
		},
		Manipulations: {
			shuffle: function(zoneName, gamestate)
			{
			},
			dealCards: function (fromZone, toZoneNameArray, numCards, gamestate)
			{
			},
			cut: function (zoneName, gamestate)
			{
			}
		},
		Sorting: {
			Player_Sorting: {

			},
			Zone_Sorting: {

			},
			Card_Sorting: {

			}
		}
	}
};


/*THIS IS HOW LAMBDAS*/
/*
function add(x){
	return function(y)
	{
		return x + y;
	};
};
add5 = add(5);
add5(1) -> 6;

function IsAttributeOverValueLambda (attributeName, upperLimit) {
	return function (obj) {
		if(obj.attributes[attributeName] > upperLimit)
		{
			return true;
		}
		return false;
	}
}
//Example of use
// var isDollarsOver666 = IsAttributeOverValueLambda("Dollars", 666)
// isDollarsOver666({attributes: {Dollars: 333}}); >>> false
// isDollarsOver666({attributes: {Dollars: 999}}); >>> true
*/