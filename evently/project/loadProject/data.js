function(data) {

	var currentproject = null
		, projects = []
		,	schema = {};

	//iterate over the result of the query.js
	data.rows.map(function(remotedoc) {
	  var typesofdoc = remotedoc.value.type;
	  if($.isArray(typesofdoc)) {
		  for (var i = 0; i < typesofdoc.length; i++) {		//iterate over types array and find projects
		  	if(typesofdoc[i] === "/type/project") {
		  	  projects.push(remotedoc.value);							//remember project for showing in the user view
		  	  if (currentproject === null) {
		  	  	currentproject = remotedoc.value;					//take the first project as current
		  	  }	  
				} 
		  }
		} else {
		 	if(typesofdoc === "/type/type") {
				schema[remotedoc.value._id] = remotedoc.value;
			}
		} 
	});

	//initilize data.js graph
	var graph = new Data.Graph(schema, {dirty: true, persistent: true});

	//graph.set(projects);											 //push projects to the graph
	  
	$$("#project").graph = graph;											//store the data.js graph in the widget state
	$$("#project").schema = schema;
	$$("#project").pros = [];
	graph
		.find({"type&=": ["/type/project"]})						//find the tasks of the current project in the graph
		.each(function(val, key, index) { 
	  	$$("#project").pros.push(val.toJSON());											//and remember them for showing in the user view
		});


	var tasks = [];
	
	graph
		.find({project: currentproject._id})						//find the tasks of the current project in the graph
		.each(function(val, key, index) { 
	  	tasks.push(val.toJSON());											//and remember them for showing in the user view
		});

	return {																					//return the actually visible data to the layout template
    projecttitle: currentproject.name,
    projects: projects,
    tasks: tasks
  };
}