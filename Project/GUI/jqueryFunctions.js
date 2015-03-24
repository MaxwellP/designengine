// Initialization
$(function() {
	$(".editor").dialog();
});

$(function() {
	$(".editor").dialog("close");
})

$(function() {
	var element = $(".codemirrorBox");
	for (var i = 0; i < element.length; i++) {
		CodeMirror(element[i]);
	};
})