function (e) {
	
	var taskid = $(this).closest("div.task").attr("task");

	if (taskid !== "") {		
		$$("#project").graph.del(taskid);
	}

	var projectid = $("a.active").attr("project");

	$(this).trigger("loadProject", [{"projectid": projectid}]);

}