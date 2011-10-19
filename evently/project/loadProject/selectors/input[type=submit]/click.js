function () {
	
	var taskname = $("#task_name").val();

	if (taskname !== "") {
		
		var projectid = $("a.active").attr("project");

		var task = {
			"_id": Data.uuid("/task/"),
			"name": taskname,
      "complete": false,
      "project": projectid,
      "type": "/type/task"
		};

		$$("#project").graph.set(task);

		$(this).trigger("loadProject", [{"projectid": projectid}]);
	};

}