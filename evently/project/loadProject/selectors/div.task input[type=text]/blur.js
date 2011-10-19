function (e) {
	
	var name = $(this).val();

	if (name !== "") {		
		
		var taskid = $(this).closest("div.task").attr("task");
		if (taskid !== "") {		
			var graph = $$("#project").graph;
			var task = graph.get(taskid).toJSON();
			
			task.name = name;
			graph.set(task);
		}

	}

	var projectid = $("a.active").attr("project");

	$(this).trigger("loadProject", [{"projectid": projectid}]);

}