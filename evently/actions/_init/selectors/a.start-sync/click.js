function () {
	
	console.log("start sync");

	$("#sync_state").text("Start syncing ...");
	
	var widget = $$("#project");
	var db = widget.app.db;
	var dinos = widget.graph.dirtyNodes();
	var lastd = dinos.last();
	var localgraph = JSON.parse(localStorage.graph);

	$("#sync_state").text("looking for local changes ...");
	dinos.each(function (doc) {
		
		var docjson = doc.toJSON();

		if (doc._deleted == true) {
			db.removeDoc(docjson);
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
			$("#sync_state").text("synced!");
			

			//TODO this event has to be called after the last doc update (deleted doc dont matter)
			//the events renders the view with the synced data and must chained after that
			var projectid = $("a.active").attr("project");
			$(this).trigger("loadProject", [{"projectid": projectid}]);
		}

	});

	//deleting and writing the docs to couchdb (bulk?)
	//howto sync? changes_api?

}