function (e, params) {

	var widget = $$(this);
	var upd_seq = localStorage.graph_update_seq;

	if(params.action === "start") {
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
	} else if(params.action === "stop") {
		widget.changesfeed.stop();
		console.log("stopping realtime syncing");
	}

	//if (upd_seq && upd_seq > 0) {
	
	function addRealtimeUpdates() {	
		console.log("switch realtime changes feed update on (since " + upd_seq + ")");

		var changesfeed = widget.app.db.changes(upd_seq, {
			"filter": "dj-taskr/changedTasks",
			"include_docs": true
		});
		widget.changesfeed = changesfeed;

		changesfeed.onChange(function(resp) {
			
			console.log("#####################" + JSON.stringify(resp));

			localStorage.graph_update_seq = resp.last_seq;

			resp.results.map(function(upddoc) {
					
				var origin = widget.graph.get(upddoc.id);

				if (origin !== undefined && upddoc.deleted === true) {
					
					console.log("== del Graph Doc =====" + origin);
					if(origin._dirty === true) {
						//TODO: implement the built in conflict handling (conflicted_rev)
						origin._conflicted = true;
						origin.dataremote = upddoc.doc;

						//TODO: control, that the task reference still exists in the project doc
						 
					} else {
						widget.graph.del(upddoc.id);
						origin._dirty = false;
					}

				} else {
					
					console.log("== new/update Graph Doc =====" + origin);
					if (origin !== undefined && origin.data !== undefined && 
						(origin._dirty === true || upddoc.doc._rev < origin.data._rev)) {
						
						origin._conflicted = true;
						//TODO: implement the built in conflict handling (conflicted_rev)
						origin.dataremote = upddoc.doc;
					
					} else { 
						
						//TODO: control, that the task references of the updated project doc
						//		containing the refs of conflicted tasks
						if(upddoc.doc.type.indexOf("/type/project") > -1) {
							console.log("watching conflicted ");
							var conflicted_tasks = widget.graph.dirtyNodes().keys().join();
							var diff_tasks = _.difference(origin.tasks, upddoc.doc.tasks);
							diff_tasks.forEach(function (diff_id) {
								if(conflicted_tasks.indexOf(diff_id) > -1) {
									upddoc.doc.tasks.push(diff_id);
								}
							});
						}

						var indoc = {};
						indoc[upddoc.id] = upddoc.doc;
						widget.graph.merge(indoc, false);
					}

				}

				if(upddoc.deleted === true || upddoc.doc.type.indexOf("/type/task") > -1) {
					$("#tasks").trigger("loadTasks", [{"task_ids": [upddoc.id]}]);
				}

			});

			/*widget.app.db.view("dj-taskr/getAllProjectsAndTasks", {
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
			});*/
			

		});
	}

	//};
}