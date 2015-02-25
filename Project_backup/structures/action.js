/**
* A logic based sequence of events
*
* @class Action
* @constructor
* @param {String} name - a unique identifier for the action
* @param {ActionTemplate} template - the template from which this event is created
* @param {Card} card - an optional field containing the id of the card the action came from
* @param {Array} inputs - an array of types over which the action takes place
* @param {Function} checkLegality - the function returns whether or not the action is legal in a given game state
* @param {Function} result - the function produces a new game state having preformed the action
*/
function Action(name, template, card, inputs, checkLegality, result)
{
	this.name = name;
	this.template = template;
	this.card = card;
	this.inputs = inputs;
	this.checkLegality = checkLegality;
	this.result = result;
}