function(data, params) {

	var currentproject = null
		, projects = []
		, tasks = []
		, graph = $$("#project").graph;

	graph
		.find({"type&=": ["/type/project"]})									//find the projects in the graph and mark the
		.each(function(val, key, index) { 										
	  	var obj = val.toJSON();
	  	if((params.projectid && params.projectid === obj._id)
		  	|| (index === 0 && !params.projectid)) {
		  	currentproject = val; 														//if none given - first found as the current project
		  }
		  if(currentproject === val) {
	  		obj.guistate = "active";
		  }
	  	projects.push(obj);																	//and remember them for showing in the user view
		});

	graph
		.find({project: currentproject._id})									//find the tasks of the current project in the graph
		.each(function(val, key, index) { 
	  	tasks.push(val.toJSON());														//and remember them for showing in the user view
		});

	return {																								//return data to the layout template
    projecttitle: currentproject.name,
    projects: projects,
    tasks: tasks
  };
}