function (e) {

	var widget = $$(this);
	var upd_seq = localStorage.graph_update_seq;

	if(upd_seq === undefined) {
		widget.app.db.info({
			"success": function(infodoc) {
				localStorage.graph_update_seq = infodoc.update_seq;
				upd_seq = infodoc.update_seq;
				addRealtimeUpdates();
			}
		});
	} else {
		addRealtimeUpdates();
	}
	

	//if (upd_seq && upd_seq > 0) {
	
	function addRealtimeUpdates() {	
		console.log("switch realtime changes feed update on (since " + upd_seq + ")");

		var changesfeed = widget.app.db.changes(upd_seq, {"filter": "dj-taskr/changedTasks"});

		changesfeed.onChange(function(resp) {
			
			console.log("######################" + JSON.stringify(resp));

			localStorage.graph_update_seq = resp.last_seq;

			widget.app.db.view("dj-taskr/getAllProjectsAndTasks", {
				"keys": $.unique(resp.results.map(function(changed_doc) {
					
					var origin = widget.graph.get(changed_doc.id);

					if (changed_doc.deleted === true) {
						console.log(origin);
						if(origin._dirty === true) {
							origin._conflicted = true;
							origin.dataremote = changed_doc;
						} else {
							widget.graph.del(changed_doc.id);
							origin._dirty = false;
						}
						$("#tasks").trigger("loadTasks", [{"task_ids":[changed_doc.id]}]);
						return;
					} else {
						return changed_doc.id;
					}

				})),
				"success": function (res) {
					
					console.log("== new Doc =====" + JSON.stringify(res));
					var task_ids = [];

					res.rows.forEach(function(upddoc,index) {
						
						var gdoc = widget.graph.get(upddoc.id);
						console.log("== new Graph Doc =====" + gdoc);
						if (gdoc !== undefined && gdoc.data !== undefined && 
							(gdoc._dirty === true || upddoc.value._rev < gdoc.data._rev)) {
							
							gdoc._conflicted = true;
							gdoc.dataremote = upddoc.value;
						} else { 
							var indoc = {};
							indoc[upddoc.id] = upddoc.value;
							widget.graph.merge(indoc, false);
						}
						
						if(upddoc.value.type.indexOf("/type/task") > -1) {
							task_ids.push(upddoc.id);	
						}

						if (index+1 == res.rows.length && task_ids.length > 0) {
							$("#tasks").trigger("loadTasks", [{"task_ids": task_ids}]);
						}

					});

				}
			});
			

		});
	}

	//};
}