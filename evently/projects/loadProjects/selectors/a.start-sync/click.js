function () {
	
	$("#messagebox").text("Start syncing ...");
	
	var widget = $$("#sync_state");
	var db = widget.app.db;
	var dinos = widget.graph.dirtyNodes();
	var lastd = dinos.last();
	var localgraph = JSON.parse(localStorage.graph);

	$("#messagebox").text("looking for local changes ...");
	dinos.each(function (doc) {
		
		var docjson = doc.toJSON();

		if (doc._deleted == true) {
			if(doc._rev !== undefined) {
				db.removeDoc(docjson);
			}
			delete localgraph[doc._id];
		} else {
			db.saveDoc(docjson, {
				"success": function(doc) {
					widget.graph.get(doc.id)._rev = doc.rev;
				}
			});
		}

		widget.graph.get(doc._id)._dirty = false;

		if(doc._id === lastd._id) {
			localStorage.graph = JSON.stringify(localgraph);
			$("#messagebox").text("synced!");
			

			//TODO this event has to be called after the last doc update (deleted doc dont matter)
			//the events renders the view with the synced data and must chained after that
			//var projectid = $("a.active").attr("project");
			//$(this).trigger("loadProject", [{"projectid": projectid}]);
		}

	});

	//deleting and writing the docs to couchdb (bulk?)
	//howto sync? changes_api?

}