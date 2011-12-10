function () {
	
	var that = $(this);
	var datawidget = $$("#sync_state");

	var newproject = datawidget
										.graph
										.get(that.attr("project"))
										.toJSON();

	datawidget.currentproject = newproject;

	$("a.active").removeClass("active");
	that.addClass("active");
	$("h1").text(newproject.name);
	
	$("#tasks")
		.children()
		.remove()
		.end()
		.trigger("loadTasks");

}