var Controller = {
	save : function (tableName)
	{
		var dbobj = this.collectFormValues(tableName);
		Db.put(tableName, dbobj);
		View.listDialog(tableName);
		return false;
	},

	addToLocalList : function(tableName, parentTable, parentKey) {
		var dbobj = this.collectFormValues(parentKey);
//		Db.put(tableName, dbobj);
		this.addCommon(tableName, parentTable, parentKey, dbobj);
		return false;
	},

	addToGlobalList : function(tableName, parentTable, parentKey) {
		var select = document.getElementById(parentTable + '_add.' + parentKey);
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
		View.edit(parentTable, parentobj);
	},

	collectFormValues : function (rootName)
	{
		var elements = document.getElementById("form").elements;
		var dbobj = {};
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.name.indexOf(rootName + '.') == 0) {
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

	remove : function (tableName, index, parentTable, parentKey, fromDb)
	{
		if (confirm('Delete this item?')) {
			if (parentTable) {
				var el = document.getElementById(parentTable + '.' + parentKey);
				var val = el.value ? JSON.parse(el.value) : [];
				var id = val[index];
				if (fromDb) {
					Db.remove(tableName, id);
				}
				val.splice (index, 1);
				el.value = JSON.stringify(val);
//				var parentobj = this.collectFormValues(parentTable);
//				Db.put(parentTable, parentobj);
				View.edit(parentTable, this.collectFormValues(parentTable));
			} else {
				// TODO split method in removeFromRoot and fromList.
				Db.remove(tableName, index); // index == id when called from root
				View.listDialog(tableName);
			}
		}
		return false;
	},

	moveRootList : function (amount, tableName, index)
	{
		var table = Table.get(tableName);
		var val = table.ids;

		var id = val[index];
		if (index+amount < 0 || index+amount >= val.length) return;
		val.splice(index, 1);
		val.splice(index+amount, 0, id);
		Table.put(table);
		View.listDialog(tableName);
		return false;
	},

	moveChildList : function (amount, tableName, rowId, key, index)
	{
		var el = document.getElementById(tableName + '.' + key);
		var val = el.value ? JSON.parse(el.value) : [];
		var id = val[index];
		if (index+amount < 0 || index+amount >= val.length) return;
console.log("" + val);
		val.splice(index, 1);
		val.splice(index+amount, 0, id);
console.log("" + val);
		el.value = JSON.stringify(val);

		View.edit(tableName, this.collectFormValues(tableName));
		return false;
	}
}
