var Controller = {
	save : function (tableName, id)
	{
		var elements = document.getElementById("form").elements;

		var dbobj = {};

		for (var i = 0; i < elements.length-1; i++) {
			var element = elements[i];

			dbobj[element.name] = element.value;
		}

		dbobj.id = id;
		Db.put(tableName, dbobj);

		// debug from here
		var table =Table.get(tableName);
		console.log(table);

		table.ids.forEach(function(id) {
			console.log(Db.get(tableName, id));
		});

		View.listDialog(tableName);
		return false;
	},
};
