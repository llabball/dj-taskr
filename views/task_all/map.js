function(doc) { 
	if (doc.type.indexOf('/type/task')>=0) { 
		emit([doc._id], doc); 
	}
}