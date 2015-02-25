/*
DESIGN-TIME GUI
*/

var zoneTreeModel;
var playerTreeModel;
var moveTemplateTreeModel;
var zoneTreeModel;


function updateTrees() {
	zoneTreeModel = {
		value: "Zones",
		kids: getAllNames(zones)
		//kids: zones
	}

	playerTreeModel = {
		value: "Players",
		kids: getAllNames(players)
		//kids: players
	}

	moveTemplateTreeModel = {
		value: "Move Templates",
		kids: getAllNames(moveTemplates)
		//kids: moveTemplates
	}

	cardTypeTreeModel = {
		value: "Card Types",
		kids: getAllNames(cardTypes)
		//kids: cardTypes
	}
	
}


zebra.ready(function() {
	eval(zebra.Import("ui", "layout"));

	var designCanvas = new zCanvas("DesignCanvas");


	// Eventually I'd like the trees to actually store the arrays instead of names
	//		But I'm not sure how to get the tree to show them properly
	var treeViewer = new zebra.ui.tree.DefViews();

	var zoneTree = new zebra.ui.tree.Tree(zoneTreeModel);
	var playerTree = new zebra.ui.tree.Tree(playerTreeModel);
	var moveTemplateTree = new zebra.ui.tree.Tree(moveTemplateTreeModel);
	var cardTypeTree = new zebra.ui.tree.Tree(cardTypeTreeModel);
	
	var treePanel = new Panel();
	treePanel.setLayout(new PercentLayout(HORIZONTAL, 2, true));

	var zoneEditPanel = new Panel();
	zoneEditPanel.setLayout(new ListLayout(STRETCH, 2));
	
	var zoneNamePanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var zoneNameTextBox = new TextField();
	zoneNamePanel.add(20, new Label("Name:"));
	zoneNamePanel.add(80, zoneNameTextBox);

	var zoneTypePanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var zoneTypeCombo = new Combo(["showEachCard", "deck"]);
	zoneTypePanel.add(20, new Label("Type:"));
	zoneTypePanel.add(80, zoneTypeCombo);

	zoneEditPanel.add(zoneNamePanel);
	zoneEditPanel.add(zoneTypePanel);

	var playerEditPanel = new Panel();
	playerEditPanel.setLayout(new ListLayout(STRETCH, 2));
	
	var playerNamePanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var playerNameTextBox = new TextField();
	playerNamePanel.add(20, new Label("Name:"));
	playerNamePanel.add(80, playerNameTextBox);

	var playerHandPanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var playerHandCombo = new Combo(getAllNames(zones));
	playerHandPanel.add(20, new Label("Hand:"));
	playerHandPanel.add(80, playerHandCombo);

	playerEditPanel.add(playerNamePanel);
	playerEditPanel.add(playerHandPanel);

	var moveTemplateEditPanel = new Panel();
	moveTemplateEditPanel.setLayout(new PercentLayout(VERTICAL, 2, true));
	
	var moveTemplateNamePanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var moveTemplateNameTextBox = new TextField();
	moveTemplateNamePanel.add(20, new Label("Name:"));
	moveTemplateNamePanel.add(80, moveTemplateNameTextBox);

	var moveTemplateDescriptionPanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var moveTemplateDescriptionTextBox = new TextField();
	moveTemplateDescriptionPanel.add(20, new Label("Description:"));
	moveTemplateDescriptionPanel.add(80, moveTemplateDescriptionTextBox);

	var moveTemplateArgTypePanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var moveTemplateArgTypeList = new List();
	var moveTemplatePossibleArgsCombo = new Combo(["zone", "player", "card"]);
	var moveTemplateRemoveButton = new Button("Remove");
	var moveTemplateAddButton = new Button("Add");
	moveTemplateArgTypePanel.add(20, new Label("Argument Types:"));
	moveTemplateArgTypePanel.add(30, moveTemplateArgTypeList);
	moveTemplateArgTypePanel.add(10, moveTemplateRemoveButton);
	moveTemplateArgTypePanel.add(30, moveTemplatePossibleArgsCombo);
	moveTemplateArgTypePanel.add(10, moveTemplateAddButton);

	var moveTemplateResultPanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var moveTemplateResultTextArea = new TextArea();
	moveTemplateResultPanel.add(20, new Label("Result Function:"));
	moveTemplateResultPanel.add(80, moveTemplateResultTextArea);

	var moveTemplateLegalityPanel = new Panel().setLayout(new PercentLayout(HORIZONTAL, 2, true));
	var moveTemplateLegalityTextArea = new TextArea();
	moveTemplateLegalityPanel.add(20, new Label("Legality Checker:"));
	moveTemplateLegalityPanel.add(80, moveTemplateLegalityTextArea);

	moveTemplateEditPanel.add(10, moveTemplateNamePanel);
	moveTemplateEditPanel.add(10, moveTemplateDescriptionPanel);
	moveTemplateEditPanel.add(20, moveTemplateArgTypePanel);
	moveTemplateEditPanel.add(30, moveTemplateResultPanel);
	moveTemplateEditPanel.add(30, moveTemplateLegalityPanel);
	

	var innerEditPanel = new Panel();
	innerEditPanel.setLayout(new StackLayout());
	
	innerEditPanel.add(zoneEditPanel);
	innerEditPanel.add(playerEditPanel);
	innerEditPanel.add(moveTemplateEditPanel);
	disableAllEditPanels();


	var editPanel = new BorderPan("Edit", innerEditPanel);
	//var editPanel = new BorderPan("Edit", new ScrollPan(innerEditPanel));
	//editPanel.setLayout(new StackLayout());

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

	zoneTree.bind(function selected(src, item) {
		setUpZoneEditPanel(item.value);
	});

	playerTree.bind(function selected(src, item) {
		setUpPlayerEditPanel(item.value);
	});

	moveTemplateTree.bind(function selected(src, item) {
		setUpMoveTemplateEditPanel(item.value);
	});

	function disableAllEditPanels() {
		zoneEditPanel.setVisible(false);
		zoneEditPanel.setEnabled(false);
		playerEditPanel.setVisible(false);
		playerEditPanel.setEnabled(false);
		moveTemplateEditPanel.setVisible(false);
		moveTemplateEditPanel.setEnabled(false);
	}

	function setUpZoneEditPanel(zoneName) {
		var zone = lookupZone(["name"], [zoneName], currentGS);
		disableAllEditPanels();
		zoneEditPanel.setVisible(true);
		zoneEditPanel.setEnabled(true);

		zoneNameTextBox.setValue(zone.name);
		zoneTypeCombo.setValue(zone.type);
	}

	function setUpPlayerEditPanel(playerName) {
		var player = lookupPlayer(playerName, currentGS);
		disableAllEditPanels();
		playerEditPanel.setVisible(true);
		playerEditPanel.setEnabled(true);

		playerNameTextBox.setValue(player.name);
		playerHandCombo.setValue(player.hand);
	}

	function setUpMoveTemplateEditPanel(templateName) {
		var moveTemplate = lookupMoveTemplate(templateName);
		disableAllEditPanels();
		moveTemplateEditPanel.setVisible(true);
		moveTemplateEditPanel.setEnabled(true);

		moveTemplateNameTextBox.setValue(moveTemplate.name);
		moveTemplateDescriptionTextBox.setValue(moveTemplate.description);
		moveTemplateArgTypeList.setModel(moveTemplate.argTypes);
		moveTemplateResultTextArea.setValue("" + window[moveTemplate.name + "Result"]);
		moveTemplateLegalityTextArea.setValue("" + window[moveTemplate.name + "CheckLegality"]);
	}
	

});

function getAllNames(obj) {
	var returnArray = [];
	for (var i = 0; i < obj.length; i++) {
		returnArray.push(obj[i].name);
	};
	return returnArray;
}




function togglePanel (panel) {
	panel.setVisible(!panel.isVisible);
	panel.setEnabled(!panel.isEnabled);
}