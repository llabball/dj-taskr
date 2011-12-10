function(doc, req) { 

	if(doc._id.indexOf('task') > 0 || doc._id.indexOf('project')) {
		return true; 
	} else {
		return false;
	}

}