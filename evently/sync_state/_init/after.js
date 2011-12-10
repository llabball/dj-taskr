function() {
	
	$("#projects").trigger("loadProjects");
	$("#tasks").trigger("loadTasks");

	$(this).trigger("realtimesync");

	$("#messagebox").text("started!");

}