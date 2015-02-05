var model =
{
    "beehives" :
    {
	names : ["Beehive", "Beehives", "A list of beehives"],
	ddl :
	{
		name : {name : "Name", type : "string", display : "entry" },
		hiveType :  {name : "Type", type : "hiveType", display : "select" },
		beeType :  {name : "Bee type", type : "beeType", display : "select" },
		frames : {name : "Frames", type : "string", display : "entry"},
		logEntries : {name : "Log entries", type : "logEntrylist", display : "locallist" }
	},
	displayName : "{lastName}, {firstName}" // doesn't do anything yet
    },
    "hiveType" :
    {
	names : ["Hive type", "Hive types", "Hive types"],
	ddl :
	{
		name : {name : "Type", type : "string", display : "entry"},
		frames : {name : "Frames", type : "string", display : "entry"},
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
    "beeType" :
    {
	names : ["Bee type", "Bee types", "Bee types"],
	ddl :
	{
		name : {name : "Name", type : "string", display : "entry"},
	}
    },
    "logEntry" :
    {
	names : ["Log entry", "Log entries", "Log entries"],
	ddl :
	{
		name : {name : "Date", type : "string", display : "entry"},
		entry : {name : "Entry", type : "string", display : "entry"},
	},
	local : true // disable this to show all the infos in the main menu
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

Db.put('beeType', {name : 'Black'});
Db.put('beeType', {name : 'Buckfast'});
Db.put('beeType', {name : 'Carnica'});
Db.put('beeType', {name : 'Killer'});
Db.put('beeType', {name : 'Wild'});

Db.put('hiveType', {name : 'Warre'});
Db.put('hiveType', {name : 'Zesramer', frames: '6', frameSize : simplexFrameSize.id });
Db.put('hiveType', {name : 'Spaarkast', frames: '10', frameSize : simplexFrameSize.id });
Db.put('hiveType', {name : 'Simplex', frames: '10', frameSize : simplexFrameSize.id });
Db.put('hiveType', {name : 'Langstroth'});
Db.put('hiveType', {name : 'Dadant', frameSize : dadantFrameSize.id });


