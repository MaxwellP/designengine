// Initialization
$(function() {
	$(".editor").dialog();
	$(".editor").dialog("close");
	actionResultCode = CodeMirror(document.getElementById("result_code"));
	actionCheckLegalityCode = CodeMirror(document.getElementById("check_legality_code"));
});
