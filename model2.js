var model =
{
    "beehives" :
    {
	names : ["Beehive", "Beehives", "A list of beehives"],
	ddl :
	{
		name : {name : "Name", type : "string", display : "entry" },
		hiveType :  {name : "Type", type : "hiveType", display : "select" },
	},
	displayName : "{lastName}, {firstName}" // doesn't do anything yet
    },
    "hiveType" :
    {
	names : ["Hive type", "Hive types", "Hive types"],
	ddl :
	{
		name : {name : "Type", type : "string", display : "entry"},
		frameSize : {name : "Frame size", type : "frameSize", display : "select"}
	}
    },
    "frameSize" :
    {
	names : ["Frame size", "Frame sizes", "Frame sizes"],
	ddl :
	{
		name : {name : "Name", type : "string", display : "entry"},
		height : {name : "Height", type : "string", display : "entry"},
		width : {name : "Width", type : "string", display : "entry"},
	}
    },
};

localStorage.clear();

for (var i in model) {
console.log("Putting " + i);
        model[i].id = i;
        Table.put(model[i]);
}

var simplexFrameSize = {name : 'Simplex', height : '10', width : '10'};
var dadantFrameSize = {name : 'Simplex', height : '10', width : '10'};

Db.put('frameSize', {name : 'n/a'});
Db.put('frameSize', simplexFrameSize);
Db.put('frameSize', dadantFrameSize);

Db.put('hiveType', {name : 'Warre'});
Db.put('hiveType', {name : 'Simplex', frameSize : simplexFrameSize.id });
Db.put('hiveType', {name : 'Langstroth'});
Db.put('hiveType', {name : 'Dadant', frameSize : dadantFrameSize.id });

