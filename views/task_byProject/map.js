function(doc) {
	if (doc.type && doc.type.indexOf('/type/task')>=0) { 
		emit([doc.project], doc);
	}
}