var Controller = {
	save : function (tableName)
	{
		var dbobj = this.collectFormValues(tableName);
		Db.put(tableName, dbobj);
		View.listDialog(tableName);
		return false;
	},

	addToParent : function(tableName, parentTable, parentKey) {
		var dbobj = this.collectFormValues(tableName);
		var el = document.getElementById(parentTable + '.' + parentKey);
		var val = el.value ? JSON.parse(el.value) : [];
		if (!val) val = [];
		Db.put(tableName, dbobj);
		val.push(dbobj.id);
		el.value = JSON.stringify(val);
		var parentobj = this.collectFormValues(parentTable);
		Db.put(parentTable, parentobj);
		View.editDialog(parentTable, parentobj.id);
		return false;
	},

	collectFormValues : function (tableName)
	{
		var elements = document.getElementById("form").elements;
		var dbobj = {};
		for (var i = 0; i < elements.length-1; i++) {
			var element = elements[i];

			if (element.name.indexOf(tableName) == 0) {
				var name = element.name.substring(tableName.length + 1, element.name.length);
				var value = element.value;
				try {
					value = JSON.parse(element.value);
				} catch (e) {
				}

				dbobj[name] = value;
			}
		}
		return dbobj;
	},

	remove : function (tableName, id, parentTable, parentKey)
	{
		if (confirm('Delete this item?')) {
			Db.remove(tableName, id);

			if (parentTable) {
				var el = document.getElementById(parentTable + '.' + parentKey);
				var val = el.value ? JSON.parse(el.value) : [];
				val.splice (val.indexOf(id), 1);
				el.value = JSON.stringify(val);
				var parentobj = this.collectFormValues(parentTable);
				Db.put(parentTable, parentobj);
				View.editDialog(parentTable, parentobj.id);
			} else {
				View.listDialog(tableName);
			}
		}
		return false;
	},
	move : function (amount, tableName, rowId, key, id)
	{
		if (tableName != 'tables') {
			// inline form; save state first
			var dbobj = this.collectFormValues(tableName);
			Db.put(tableName, dbobj);
		}

		var row = Db.get(tableName, rowId);
		var val = row[key];
		var index = val.indexOf(id);
		if (index+amount < 0 || index+amount >= val.length) return;
		val.splice(index, 1);
		val.splice(index+amount, 0, id);
		Db.put(tableName, row);

		if (tableName == 'tables') {
			View.listDialog(rowId);
		} else {
			View.editDialog(tableName, dbobj.id);
		}
		return false;
	}
}
