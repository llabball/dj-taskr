function(doc) { 
	if (doc.type === "/type/type") {
		emit(doc._id, doc); 
	}
}