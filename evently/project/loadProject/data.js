function(data, params) {

	var currentproject = null
		, projects = []
		, tasks = []
		, graph = $$("#project").graph;

	graph
		.find({"type&=": ["/type/project"]})									//find the projects in the graph
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
		.find({																								//find the tasks of the current project in the graph
			"project": currentproject._id,
			"_deleted!=": true
		})												
		.each(function(val, key, index) { 
	  	var valobj = val.toJSON();
	  	if(valobj.complete === true) {
	  		valobj.completed = 'complete';
	  	}
	  	if(val._dirty === true) {
	  		valobj.pending = '<span class="tag">pending</span>';
	  	}
	  	tasks.push(valobj);																	//and remember them for showing in the user view
		});

	return {																								//return data to the layout template
    projecttitle: currentproject.name,
    projects: projects,
    tasks: tasks
  };
}