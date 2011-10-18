function(data) {

	var	schema = {};

	data.rows.map(function(remotedoc) {											//iterate over the result of the query.js and build 
	  var typesofdoc = remotedoc.value.type;								//the schema with docs of type == type
	  if(typesofdoc === "/type/type") {
			schema[remotedoc.value._id] = remotedoc.value;
		}
	});

	var graph = new Data.Graph(schema, {										//initilize data.js graph with the schema
		dirty: true, 																					//cant explain why the nodes then are already there
		persistent: true
	});
	  
	$$("#project").graph = graph;														//store the data.js graph in the widget state
}