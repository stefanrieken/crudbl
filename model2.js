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
		queenDate :  {name : "Queen date", type : "string", display : "date" },
		frames : {name : "Frames", type : "string", display : "number"},
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
		frames : {name : "Frames", type : "string", display : "number"},
		frameSize : {name : "Frame size", type : "frameSize", display : "number"}
	}
    },
    "frameSize" :
    {
	names : ["Frame size", "Frame sizes", "Frame sizes"],
	ddl :
	{
		name : {name : "Name", type : "string", display : "entry"},
		width : {name : "Width", type : "string", display : "number"},
		broodHeight : {name : "Height (brood)", type : "string", display : "number"},
		honeyHeight : {name : "Height (honey)", type : "string", display : "number"},
		ear : {name : "Ear", type : "string", display : "number"},
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
		name : {name : "Date", type : "string", display : "date"},
		entry : {name : "Entry", type : "string", display : "entry"},
	},
	local : true // disable this to show all the infos in the main menu
    },
};

//localStorage.clear();

if (!Db.get('tables', 'beehives')) {
	localStorage.clear();

	for (var i in model) {
		console.log("Putting " + i);
		model[i].id = i;
		Table.put(model[i]);
	}

	var simplexFrameSize = {name : 'Simplex',  width : '360', broodHeight : '218', honeyHeight : '140', ear : '37.5'};
	var dadantFrameSize = {name : 'Dadant-Blatt', width : '435', broodHeight : '300', honeyHeight : '160', ear : '17.5'};
	var miniPlusFrameSize = {name : 'Mini-Plus', width : '218', broodHeight : '159', honeyHeight : '', ear : '15'};

	Db.put('frameSize', {name : 'n/a'});
	Db.put('frameSize', simplexFrameSize);
	Db.put('frameSize', dadantFrameSize);
	Db.put('frameSize', miniPlusFrameSize);

	Db.put('beeType', {name : 'Black'});
	Db.put('beeType', {name : 'Buckfast'});
	Db.put('beeType', {name : 'Carnica'});
	Db.put('beeType', {name : 'Killer'});
	Db.put('beeType', {name : 'Wild'});

	Db.put('hiveType', {name : 'Warre'});
	Db.put('hiveType', {name : 'Zesramer', frames: '6', frameSize : simplexFrameSize.id });
	Db.put('hiveType', {name : 'Spaarkast', frames: '10', frameSize : simplexFrameSize.id });
	Db.put('hiveType', {name : 'Simplex', frames: '10', frameSize : simplexFrameSize.id });
	Db.put('hiveType', {name : 'Dadant-Blatt', frames: 11, frameSize : dadantFrameSize.id});
	Db.put('hiveType', {name : 'Mini-Plus', frames: 6, frameSize : miniPlusFrameSize.id});
}
