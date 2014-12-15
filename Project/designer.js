/*
DESIGN-TIME GUI
*/

zebra.ready(function() {
	eval(zebra.Import("ui", "layout"));

	var designCanvas = new zCanvas("DesignCanvas");

	var zoneTreeModel = {
		value: "Zones",
		kids: getAllNames(zones)
	}

	var playerTreeModel = {
		value: "Players",
		kids: getAllNames(players)
	}

	var moveTemplateTreeModel = {
		value: "Move Templates",
		kids: getAllNames(moveTemplates)
	}

	var cardTypeTreeModel = {
		value: "Card Types",
		kids: getAllNames(cardTypes)
	}

	var zoneTree = new zebra.ui.tree.Tree(zoneTreeModel);
	var playerTree = new zebra.ui.tree.Tree(playerTreeModel);
	var moveTemplateTree = new zebra.ui.tree.Tree(moveTemplateTreeModel);
	var cardTypeTree = new zebra.ui.tree.Tree(cardTypeTreeModel);
	
	var treePanel = new Panel();
	treePanel.setLayout(new PercentLayout(HORIZONTAL, 2, true));

	var editPanel = new BorderPan("Edit", new Panel());

	var zonePanel = new BorderPan("Zones", new ScrollPan(zoneTree));
	var playerPanel = new BorderPan("Players", new ScrollPan(playerTree));
	var moveTemplatePanel = new BorderPan("Move Templates", new ScrollPan(moveTemplateTree));
	var cardTypePanel = new BorderPan("Card Types", new ScrollPan(cardTypeTree));

	treePanel.add(25, zonePanel);
	treePanel.add(25, playerPanel);
	treePanel.add(25, moveTemplatePanel);
	treePanel.add(25, cardTypePanel);

	// Create zebra canvas
	var root = designCanvas.root;
	root.setBorder(borders.plain);
	root.setLayout(new PercentLayout(VERTICAL, 2, true));

	root.properties({
		padding : 8
	})

	root.add(25, treePanel);
	root.add(75, editPanel);
});

function getAllNames(obj) {
	var returnArray = [];
	for (var i = 0; i < obj.length; i++) {
		returnArray.push(obj[i].name);
	};
	return returnArray;
}
