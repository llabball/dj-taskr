function(doc) { 
 if(doc.type[0].length > 1) {
  for(var i = 0;i < doc.type.length;i++) { 
   if (doc.type[i] === "/type/project") { 
     emit([doc._id, 0], doc); 
   } else if (doc.type[i] === "/type/task") {
     emit([doc.project, 1], doc);
   } 
  }
 } else {
  if (doc.type === "/type/type") {
     emit(doc._id, doc);
  } 
 }
}