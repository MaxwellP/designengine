// Initialization
$(function() {
	$("#menu").dialog({ dialogClass: 'no-close' });
	$(".editor").dialog({close: function( event, ui ) {
		var editorID = $(this).attr('id');
		if (editorID === "card_editor")
		{
			currentCard = undefined;
		}
		else if (editorID === "zone_editor")
		{
			currentZone = undefined;
		}
		else if (editorID === "player_editor")
		{
			currentPlayer = undefined;
		}

	}});
	$(".editor").dialog("close");
	//$(".editor").mouseup(overlapMouseUp(event));
	actionResultCode = CodeMirror(document.getElementById("result_code"));
	actionCheckLegalityCode = CodeMirror(document.getElementById("check_legality_code"));
	otherCode = CodeMirror(document.getElementById("other_code"));
	phaseInitCode = CodeMirror(document.getElementById("initCode"));
	phaseEndCode = CodeMirror(document.getElementById("endConditionCode"));
});
