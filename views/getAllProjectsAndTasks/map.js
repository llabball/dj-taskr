function(doc) { 
 for(var i = 0;i < doc.type.length;i++) { 
  if (doc.type[i] === "/type/project") { 
    emit([doc._id, 0], doc); 
  } else if (doc.type[i] === "/type/task") {
    emit([doc.project, 1], doc);
  }
 }
}