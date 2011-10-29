function(data) {

	var	schema = {};
	var docs = {}

	localStorage.clear();																		//reseting the local storage
	
	data.rows.map(function(remotedoc) {											//iterate over the result of the query.js 
	  var typesofdoc = remotedoc.value.type;	
	  
	  if($.isArray(typesofdoc)) {						
			
			for (var i = 0; i < typesofdoc.length; i++) {				
				if(typesofdoc[i] === "/type/task" ||	typesofdoc[i] === "/type/project") {					
					docs[remotedoc.value._id] = remotedoc.value;		//insert docs of type == task|project to the graph
				}
			}

		} else if(typesofdoc === "/type/type") {
			
			schema[remotedoc.value._id] = remotedoc.value;			//and build the schema with docs of type == type
		
		}																											//TODO: may the better way is to get the schema (commonjs?)
	});

	var graph = new Data.Graph(schema, {										//initilize data.js graph with the schema
		persistent: true
	});

	graph.merge(docs);																			//merge the doc with state "_dirty: undefined"
		  
	$$("#project").graph = graph;														//store the data.js graph in the widget state

	graph.bind("dirty", function(node) {
		console.log("Status changed on doc " + node + JSON.stringify(node));
	});
	//graph.watch('persons', {"location": "/location/springfield"}, function(err, nodes) {
	//	console.log("Status changed on doc " + nodes);
	//});
}