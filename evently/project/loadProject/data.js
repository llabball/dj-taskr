function(e) {
  
var schema =

  { 
  "/type/project": {
    "_id": "/type/project",
    "type": "/type/type",
    "name": "Project",
    "properties": {
      "name": {
        "name": "Name",
        "unique": true,
        "type": "string",
        "required": true
      },
      "tasks": {
        "name": "Tasks",
        "unique": false,
        "sync": true,
        "type": ["/type/task"]
      }
    },
    "indexes": {
      "key": ["creator", "name"],
      "creator": ["creator"]
    }
  },
  
  "/type/task": {
    "_id": "/type/task",
    "type": "/type/type",
    "name": "Task",
    "properties": {
      "name": {
        "name": "Task Name",
        "unique": true,
        "type": "string"
      },
      "complete": {
        "name": "Complete",
        "unique": true,
        "type": "boolean"
      },
      "project": {
        "name": "Project Membership",
        "unique": true,
        "type": "/type/project"
      }
    },
    "indexes": {
      "project": ["project"]
    }
  }
};


var graph = new Data.Graph(schema, {dirty: true, persistent: true});

$$("#project").graph = graph.get("/type/task").toJSON();


  return {
    projecttitle: "Project 2",
    projects: [
    	{_id:"12345",name:"Project 1"},
    	{_id:"67890",name:"Project 2"}
    ],
    tasks: [
    	{_id:"t1",name:"cleaning",_rev:"1121212"},
    	{_id:"t2",name:"cocking",_rev:"4353543"},
    	{_id:"t3",name:"washing",_rev:"456456"}
    ]
  };
}