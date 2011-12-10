function () {
	
	var taskname = $("#task_name").val();
	var that = $(this);


	if (taskname !== "") {
		
		var datawidget = $$("#sync_state");
		var projectid = datawidget.currentproject._id;
		var taskid = Data.uuid("/task/");
		var graph = datawidget.graph;

		var task = {};
		task[taskid] = {
			"_id": taskid,
			"name": taskname,
			"complete": false,
			"project": projectid,
			"type": "/type/task"
		}

		graph.merge(task, true);

		var project = graph.get(projectid);
		var projobj = project.toJSON();

		projobj.tasks.push(taskid);
		project.set({"tasks": projobj.tasks});

		datawidget.currentproject = projobj;

		$("#task_name").select();
	};

}