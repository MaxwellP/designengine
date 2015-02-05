/**
* The pieces of a player's turn
*
* @class Phase
* @constructor
* @param {String} name - the name of the phase - must be unique
* @param {Function} init - a function executed at the beginning of the phase
* @param {Function} endConditions - a function that is checked after each action is taken in a given phase, if true is returned the phase has met its end condition and the endPhase event is called
*/
function Phase(name, init, endConditions)
{
	this.name = name;
	this.init = init;
	this.endConditions = endConditions;
}