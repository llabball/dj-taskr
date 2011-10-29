function () {
	
	var taskname = $("#task_name").val();

	if (taskname !== "") {
		
		var projectid = $("a.active").attr("project");
		var taskid = Data.uuid("/task/");
		var graph = $$("#project").graph;

		var task = {
			"_id": taskid,
			"name": taskname,
      "complete": false,
      "project": projectid,
      "type": "/type/task"
		};

		graph.set(task);
		
		var project = graph.get(projectid);
		var tasks = project.toJSON().tasks;

		tasks.push(taskid);
		project.set({"tasks": tasks});

		$(this).trigger("loadProject", [{"projectid": projectid}]);
	};

}