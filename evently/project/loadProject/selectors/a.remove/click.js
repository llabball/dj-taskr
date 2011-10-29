function (e) {
	
	var taskid = $(this).closest("div.task").attr("task");


	if (taskid !== "") {		
		var graph = $$("#project").graph;

		graph.del(taskid);

		var task = graph.get(taskid);
		if (task._rev === undefined) {
			task._dirty = undefined;
		}

		//also remove the task from the project2task reference array
		var projectid = $("a.active").attr("project");
		var project = graph.get(projectid);
		var tasks = project.toJSON().tasks;

		var idx = $.inArray(taskid, tasks);

		tasks.splice(idx,1);
		
		project.set({"tasks": tasks});

	}


	$(this).trigger("loadProject", [{"projectid": projectid}]);

}