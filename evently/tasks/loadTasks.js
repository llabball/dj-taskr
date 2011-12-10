function(e, params) {

	var app = $$(this).app;
	var Mustache = app.require("vendor/couchapp/lib/mustache");
	
	var datawidget = $$("#sync_state")
		, currentproject = datawidget.currentproject
		, task_ids = []
		, graph = datawidget.graph;

	
	if (params && params.task_ids && params.task_ids.length > 0) {
		
		task_ids = params.task_ids;

	}	else {											

		task_ids = currentproject.tasks;

	}//else		

	console.log(task_ids);

	task_ids.forEach(function(taskid) { 
		  	
	  	var val = graph.get(taskid);  	

	  	if(val.toJSON().project === currentproject._id) {
		  	var origtasks = $("div[task='" + taskid + "'], div[remotetask='" + taskid + "']");
		  	
		  	if(val._deleted == true) {
				
				origtasks.fadeTo("slow", 0.00, function(){ //fade
					$(this).slideUp("slow", function() { //slide up
					  $(this).remove(); //then remove from the DOM
					});
				});

			} else {
				
				var htmltask = renderTask();

				if (origtasks.length > 0) {
					origtasks.first().replaceWith(htmltask).end().last().remove();
				} else {
					$("#tasks").prepend(htmltask);	
				}

				addEvents();

			}//else
		}//if
		  									
		  
		  function renderTask () {
		  	var valobj = val.toJSON();
	  	
		  	valobj.completed = function() {
		  		return valobj.complete;
		  	};
		  	
		  	valobj.pending = function() {
		  		return val._dirty;
		  	};

		  	valobj.conflicted = function() {
		  		return val._conflicted;
		  	};

		  	if(val._rev && val._rev !== "") {
			  	valobj.rev = val._rev.split("-")[0];
		  	} else {
		  		valobj.rev = "none";
		  	}

		  	if (val._conflicted) {
		  		if(val.dataremote.deleted && val.dataremote.deleted === true) {
			  		valobj.remotedeleted = function() {
		  				return true;
			  		};
			  		valobj.remoterev = val.dataremote.changes[0].rev.split("-")[0];
			  		valobj.remotename = "this is deleted";
		  		} else {
		  			valobj.remotecompleted = function() {
		  			return val.dataremote.complete;
			  		};
			  		valobj.remoterev = val.dataremote._rev.split("-")[0];
			  		valobj.remotename = val.dataremote.name;
		  		}
		  	}

		  	return Mustache.to_html(app.ddoc.templates.task, valobj);
		  }//renderTask

		  function addEvents () {
		  	$("div[task='" + taskid + "']")
		  	
		  	.find("a.remove")
	  		.click(function() {
	  			graph.del(taskid);
	  			var proj = datawidget.currentproject;
				var tasks = proj.tasks;
				var idx = $.inArray(taskid, tasks);

				if(idx > -1) {
					tasks.splice(idx,1);
					proj.tasks = tasks;
					graph.get(proj._id).set({"tasks": tasks});
				}
	  		})
	  		
	  		.end()
	  		.find("div.checkbox")
	  		.click(function() {
	  			var completed = ($(this).closest("div.task").hasClass("complete")) ? false : true;
					graph.get(taskid).set({"complete": completed});
	  		})

	  		.end()
	  		.find(".tag:contains('local')")
	  		.click(
		  		function () {
			    	var task = graph.get(taskid);
			    	var taskobj = task.toJSON(); 
			    	
			    	task._dirty = false;
			    	task._conflicted = false;

			    	taskobj._rev = task.dataremote._rev;
			    	
			    	var indoc = {};
			    	indoc[taskobj._id] = taskobj;
			    	
			    	graph.merge(indoc,true);
			  	}
			)

	  		.end()
	  		.find("input[type=text]")
	  		.blur(function() {
	  			var name = $(this).val();
					if (name !== "" && taskid !== "") {					
						graph.get(taskid).set({"name": name});
					}
	  		});


	  		$("div[remotetask='" + taskid + "']")
		  		.find(".tag:contains('remote')")
		  		.click(
			  		function () {
				    	var task = graph.get(taskid);
				    	var taskobj = task.toJSON(); 
				    	
				    	task._dirty = false;
				    	task._conflicted = false;

				    	taskobj = task.dataremote;
				    	
				    	var indoc = {};
				    	indoc[taskobj._id] = taskobj;
				    	
				    	graph.merge(indoc,true);
				  	}
				)
		  }//addEvents
	  										
	});//tasks.forEach

}