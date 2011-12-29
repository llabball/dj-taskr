function(doc, req) { 

	if(doc._id.match("/task/.{32,32}") || doc._id.match("/project/.{32,32}")) {
		return true; 
	} else {
		return false;
	}

}