function  () {
	
	$("#messagebox").text("Start syncing ...");
	
	var widget = $$("#sync_state");
	var db = widget.app.db;
	var dinos = widget.graph.dirtyNodes();
	var localgraph = JSON.parse(localStorage.graph);

	$("#messagebox").text("looking for local changes ...");
	dinos.each(function (doc, key, index) {
		
		var docjson = doc.toJSON();

		if (doc._deleted === true) {
			if(doc._rev !== undefined) {
				db.removeDoc(docjson);
			}
			delete localgraph[doc._id];
			localStorage.graph = JSON.stringify(localgraph);
		} else {
			db.saveDoc(docjson, {
				"success": function(dbdoc) {
					widget.graph.get(dbdoc.id)._rev = dbdoc.rev;

					if(docjson.type.indexOf("/type/task") > -1) {
						$("#tasks").trigger("loadTasks", [{"task_ids": [dbdoc.id]}]);
					}
					
					if(index+1 === dinos.length) {
						db.info({
							"success": function(infodoc) {
								localStorage.graph_update_seq = infodoc.update_seq;
							}
						});
					}

				}
			});
		}

		widget.graph.get(doc._id)._dirty = false;

	});	

	$("#messagebox").text(dinos.length + " docs are updated!");
}