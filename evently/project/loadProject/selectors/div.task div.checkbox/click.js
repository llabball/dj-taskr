function (e) {
	
	var taskid = $(this).closest("div.task").attr("task");
	if (taskid !== "") {		
		var graph = $$("#project").graph;
		var task = graph.get(taskid).toJSON();
		
		if(task.complete && task.complete === true) {
			task['complete'] = false;
		} else {
			task.complete = true;
		}
		graph.set(task);
	}

	var projectid = $("a.active").attr("project");

	$(this).trigger("loadProject", [{"projectid": projectid}]);
}