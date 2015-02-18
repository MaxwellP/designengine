/*Card Counting Functions*/
function CountCardsInZone(zoneName, gs)
{
	var zone = lookupZone(zoneName, gs);
	return zone.cards.length;
}
function CountCardsOfTypeInZone(zoneName, cardTypeName, gs)
{
	var zone = lookupZone(zoneName, gs);
	var cards = zone.cards;
	var count = 0;
	for(var i = 0; i < cards.length; i += 1)
	{
		if(cards[i].name == "cardTypeName")
		{
			count += 1;
		}
	}
	return count;
}
function CountCardsInZoneThatMeetRequirement(zoneName, requirementFunc, gs)
{
	var zone = lookupZone(zoneName, gs);
	var cards = zone.cards;
	var count = 0;
	for(var i = 0; i < cards.length; i += 1)
	{
		if(requirementFunc(cards[i]) === true)
		{
			count += 1;
		}
	}
	return count;
}
/*Card Drawing Functions*/
function DrawCard(fromZone, toZone, gs)
{
	Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0],toZone,gamestate);
}
function DrawCards(fromZone, toZone, numCards, gs)
{
	for(var i = 0; i < numCards; i += 1)
	{
		Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0], toZone, gamestate);
	}
}
/*Value Comparison Functions*/
function IsAttributeOverValue(obj, attributeName, upperLimit)
{
	if(obj.attributes[attributeName] > upperLimit)
	{
		return true;
	}
	return false;
}
function IsAttributeUnderValue(obj, attributeName, lowerLimit)
{
	if(obj.attributes[attributeName] < upperLimit)
	{
		return true;
	}
	return false;
}
/*Value Assignment Functions*/
function IncreaseAttributeValue(obj, attributeName, toIncreaseBy)
{
	Event.changeAttribute(obj, attributeName, obj.attributes[attributeName] + toIncreaseBy);
}
function DecreaseAttributeValue(obj, attributeName, toDecreaseBy)
{
	Event.changeAttribute(obj, attributeName, obj.attributes[attributeName] - toDecreaseBy);
}
/*Die Roll Functions*/
function RollDie(numSides)
{
	return Math.floor(Math.random() * numSides) + 1;
}
function RollNDie(numSides, toRoll)
{
	var results = [];
	for(var i = 0; i < toRoll; i += 1)
	{
		results.push(Math.floor(Math.random() * numSides) + 1);
	}
	return results;
}
function RollSpecialDie(values)
{
	return values[Math.floor(Math.random() * values.length - 1) + 1];
}
function RollNSpecialDie(values, toRoll)
{
	var results = [];
	for(var i = 0; i < toRoll; i += 1)
	{
		results.push(values[Math.floor(Math.random() * values.length - 1) + 1]);
	}
	return results;
}
/*Group Card Movement Functions*/
function MoveAllCards(fromZone, toZone, gs)
{
	for(var i = 0; i < fromZone.length; i +=1)
	{
		Event.moveCardToZone(lookupZone(fromZone, gamestate).cards[0], toZone, gs);}
	}
}
function MoveAllCardsOfType(fromZone, toZone, cardTypeName, gs)
{
	/*THIS CODE WORKS*/
	/*
	for(var i = fromZone.length - 1; i >= 0; i -= 1)
	{
		if(lookupZone(fromZone, gs).cards[i].name == cardTypeName)
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
	}
	*/
	/*THIS CODE ALSO WORKS*/
	var i = 0;
	while(i < fromZone.length)
	{
		if(lookupZone(fromZone, gs).cards[i].name == cardTypeName))
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
		else
		{
			i += 1;
		}
	}
}

function MoveAllCardsWithAttributeValue(fromZone, toZone, attributeName, attributeValue, gs)
{
	/*THIS CODE WORKS*/
	/*
	for(var i = fromZone.length - 1; i >= 0; i -= 1)
	{
		if(lookupZone(fromZone, gs).cards[i][attributeName] == attributeValue))
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
	}
	*/
	/*THIS CODE ALSO WORKS*/
	var i = 0;
	while(i < fromZone.length)
	{
		if(lookupZone(fromZone, gs).cards[i][attributeName] == attributeValue))
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
		else
		{
			i += 1;
		}
	}
}
function MoveAllCardsThatMeetRequirement(fromZone, toZone, requirementFunc, gs)
{
	/*THIS CODE WORKS*/
	/*
	for(var i = fromZone.length - 1; i >= 0; i -= 1)
	{
		if(requirementFunc(lookupZone(fromZone, gs).cards[i][attributeName]))
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
	}
	*/
	/*THIS CODE ALSO WORKS*/
	var i = 0;
	while(i < fromZone.length)
	{
		if(requirementFunc(lookupZone(fromZone, gs).cards[i][attributeName]))
		{
			Event.moveCardToZone(lookupZone(fromZone, gs).cards[i], toZone, gs);}
		}
		else
		{
			i += 1;
		}
	}
}
/*Deck Shuffling and Card Dealing Functions*/
function shuffle(zoneName, gs)
{
	/*Fisher-Yates Shuffle*/
	var deck = lookupZone(zoneName, gs).cards;
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
function dealCards(fromZone, toZoneArray, numCards, gs)
{
	for(var i = 0; i < numCards; i += 1)
	{
		for(var j = 0; j < toZoneArray.length; j +=1)
		{
			Event.moveCardToZone(deckZone.cards[0], toZoneArray[j], gs);
		}
	}
}
function cut(zoneName, gs)
{
	var deck = lookupZone(zoneName, gs).cards;
	randomIndex = Math.floor(Math.random() * deck.length); 
	return deck[randomIndex];
}
/*Zone-Card Sorting Functions*/
//sortZoneByCardType(zoneName)
//sortZoneByCardAttributeValue(zoneName, attributeName, attributeValue)

/*Player Sorting Functions*/
//sortPlayerByAttributeValue
//sortPlayerByCardsInZone
//sortPlayerBy

/*TODO*/
/*
	getIndexOfCardInZone()
	moveCardFromZoneToZone()
	moveCardFromIndexOfZoneToZone()

	TakeAnotherTurn(gs)
	RepeatPhase(phaseName, gs)
	WinGame(playerName)
	LoseGame(playerName, gs)
	EliminatePlayer(playerName, gs)
	Declare Vocabulary (lambda)
		Pattern recognition for poker?
*/




//Lambda function creators

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

