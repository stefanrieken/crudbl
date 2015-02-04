var Controller = {
	save : function (tableName)
	{
		var dbobj = this.collectFormValues(tableName);
		Db.put(tableName, dbobj);
		View.listDialog(tableName);
		return false;
	},

	addToParent : function(tableName, parentTable, parentKey) {
		var dbobj = this.collectFormValues(parentKey);
		Db.put(tableName, dbobj);
		this.addCommon(tableName, parentTable, parentKey, dbobj.id);
		return false;
	},

	addExisting : function(tableName, parentTable, parentKey) {
		var select = document.getElementById(parentTable + '.add_' + parentKey);
		var id = JSON.parse(select.options[select.selectedIndex].value);
		this.addCommon(tableName, parentTable, parentKey, id);
		return false;
	},

	addCommon : function(tableName, parentTable, parentKey, id) {
		var el = document.getElementById(parentTable + '.' + parentKey);
		var val = el.value ? JSON.parse(el.value) : [];
		if (!val) val = [];
		if(val.indexOf(id) > -1) return; // keep entries unique
		val.push(id);
		el.value = JSON.stringify(val);
		var parentobj = this.collectFormValues(parentTable);
		Db.put(parentTable, parentobj);
		View.editDialog(parentTable, parentobj.id);
	},

	collectFormValues : function (rootName)
	{
		var elements = document.getElementById("form").elements;
		var dbobj = {};
		for (var i = 0; i < elements.length-1; i++) {
			var element = elements[i];

			if (element.name.indexOf(rootName) == 0) {
				var name = element.name.substring(rootName.length + 1, element.name.length);
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
