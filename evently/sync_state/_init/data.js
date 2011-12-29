function(data) {

	var	schema = {};
	var docs = {};
	var currentproject = null;
	var widget = $$("#sync_state");

	localStorage.clear();

	data.rows.map(function(rdoc) {	
		var remotedoc = rdoc.value;
		var typesofdoc = remotedoc.type;	
	  
	  if($.isArray(typesofdoc)) {						
			
			for (var i = 0; i < typesofdoc.length; i++) {				
				if(typesofdoc[i] === "/type/task" ||	typesofdoc[i] === "/type/project") {
					if(currentproject === null && typesofdoc[i] === "/type/project") {
						currentproject = remotedoc;
					}			
					docs[remotedoc._id] = remotedoc;
				}
			}

		} else if(typesofdoc === "/type/type") {
			
			schema[remotedoc._id] = remotedoc;
		
		}																											
	});

	var graph = new Data.Graph(schema, {persistent: true});

	graph.merge(docs);													
		  
	widget.graph = graph;
	widget.currentproject = currentproject;			
	
	widget.app.db.info({
		"success": function(infodoc) {
			localStorage.graph_update_seq = infodoc.update_seq;
		}
	});					

	graph.bind("dirty", function(node) {
		console.log("Status changed on doc " + node + JSON.stringify(node));
		
		if(node.data.type == "/type/task" && widget.currentproject._id === node.data.project) {
			
			$("#tasks").trigger("loadTasks", [{"task_ids": [node._id]}]);
			console.log("task ui has to be updated");	
		
		} else if(node.data.type == "/type/project") {
			console.log("project ui has to be updated");
		}
	});

}