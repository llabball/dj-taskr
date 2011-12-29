function (e, params) {
	
	if(localStorage.graph !== undefined) {
		//$("#projects").trigger("loadProjects");
		//$("#tasks").trigger("loadTasks");
		$("#messagebox").text("started!");
	} else {
		$(this).trigger("bak");
	}

}