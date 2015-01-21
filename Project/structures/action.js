/*Action: a logic based sequence of events*/
function Action(name, template, card, inputs, checkLegality, result)
{
	this.name = name;
	this.template = template;
	this.card = card;
	this.inputs = inputs;
	this.checkLegality = checkLegality;
	this.result = result;
}