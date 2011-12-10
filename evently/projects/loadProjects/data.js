function(e) {

	var datawidget = $$("#sync_state")
		, currentproject = datawidget.currentproject
		, projects = []
		, graph = datawidget.graph;
	
	graph
		.find({
			"type&=": ["/type/project"]
		})
		.each(function(val, key, index) { 										
		  var obj = val.toJSON();
			if(currentproject._id === key) {
		  	  obj.guistate = "active";
			}
		  	projects.push(obj);
		});

	return {			
	    projecttitle: currentproject.name,
	    projects: projects
  	};
}