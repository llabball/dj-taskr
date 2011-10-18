function () {
	$(this).trigger("loadProject", [{"projectid": $(this).attr("project")}]);
}