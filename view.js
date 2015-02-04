View = {
	overview : function(tableName) {
		var html = this.menu();
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	menu : function() {
		var html = '';

		var tables = Table.get('tables');
		for (var i in tables.ids) {
			var table = Table.get(tables.ids[i]);
			if (table.local) continue;
			html += '<a href="#" onclick="View.listDialog(\'' + tables.ids[i] + '\')">' + table.names[1] + '</a> ';
		}

		return html;
	},

	listDialog : function(tableName) {
		var html = this.menu();
		html += this.list(tableName);

		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	list : function (tableName, ids, parentTable, parentKey, parentId)
	{
		var table = Table.get(tableName);
		if (!parentTable) ids = table.ids;

		var html = '<table><tr>';
		for (var i in table.ddl) {
			if (table.ddl[i].display.indexOf('list') > -1) continue;
			html += '<th>' + table.ddl[i].name + '</th>';
		}
		html += parentTable ? '<th>&nbsp;</th></tr>' : '<th><a href="#" onclick="View.editDialog(\'' + tableName + '\')">[+]</a></th></tr>';

		for (var i in ids) {
			html += '<tr>';
			var row = Db.get(tableName, ids[i]);
			for (var key in table.ddl) {
				if (table.ddl[key].display.indexOf('list') > -1) continue;
				var value = table.ddl[key].display != 'select' ? row[key] : Db.get(table.ddl[key].type, row[key]).name;
				html += '<td><a href="#" onclick="View.editDialog(\'' + tableName + '\',' + table.ids[i] + ')">' + value + '</a></td>';
			}
			var parentPart = parentTable ? ', \'' + parentTable + '\', \'' + parentKey + '\'' : '';

			html += '<td><a href="#" onclick="Controller.remove(\'' + tableName + '\', ' + ids[i] + parentPart +')">[-]</a>'

			var moveTable = parentTable ? parentTable : 'tables';
			var moveRowId = parentTable ? parentId : tableName;
			var moveKey = parentTable ? parentKey : 'ids';


			html += '<a href="#" onclick="Controller.move(-1, \'' + moveTable + '\', \'' + moveRowId + '\', \'' + moveKey + '\', ' + ids[i] + ')">[^]</a>';
			html += '<a href="#" onclick="Controller.move(1, \'' + moveTable + '\', \'' + moveRowId + '\', \'' + moveKey + '\', ' + ids[i] + ')">[v]</a>';

			html += '</td></tr>';
		}

		if (parentTable) {
			html += '<tr>';
			for (var key in table.ddl) {
				if (table.ddl[key].display.indexOf('list') > -1) continue;
				var input = this[table.ddl[key].display].apply(this, [tableName, table.ddl[key], key, '']);
				html += '<td>' + input + '</td>';
			}
			html += '<td><a href="#" onclick="Controller.addToParent(\'' + tableName + '\', \'' + parentTable + '\', \'' + parentKey + '\')">[+]</a></tr>';
		}

		html += '</table>';
		return html;
	},

	editDialog : function (tableName, id)
	{
		var table = Table.get(tableName);
		var row = id ? Db.get(tableName, id) : {};

		var html = this.menu();
		html += '<form id="form">';
		if (id) html += this.input("hidden", tableName, "id", id);
		html += '<table><tr colspan="2"><th>' + name + '</th></tr>';

		for (var key in table.ddl)
		{
			var ddl = table.ddl[key];
			var value=row[key] ? row[key] : '';
			
			if (ddl.display == 'locallist') {
				var listTableName = ddl.type.substring(0, ddl.type.indexOf('list'));
				html += '<tr><td colspan="2">' + this.input("hidden", tableName, key, JSON.stringify(value));
				html += this.list(listTableName, value, tableName, key, id);
				html += '</td></tr>';
			} else {
				// select applicable function based on data type
				var input = this[ddl.display].apply(this, [tableName, ddl, key, value]);
				html += '<tr><td>' + ddl.name + '</td><td>' + input + '</td></tr>';
			}
		}

		var idString = id ? ',' + id : '';
		html += '</table><button onclick="return Controller.save(\'' + tableName + '\');">Save</button></form>';
		html += '<a href="#" onclick="View.listDialog(\'' + tableName + '\')">[&lt;-]</a>';
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	entry : function (parentTable, ddl, name, value)
	{
		return this.input ("text", parentTable, name, value);
	},

	select : function (parentTable, ddl, name, value)
	{
                var table = Table.get(ddl.type);
		var result = '<select ' + this.idAndName(parentTable, name) + '>';
		for (var i in table.ids) {
			var row = Db.get(ddl.type, table.ids[i]);
			var thisValue = ddl.displayName ? 'todo' : row.name;
			var selected = thisValue == value ? ' selected="true"' : '';
			result += '<option value="' + row.id + '"' + selected + '>' + thisValue +'</option>';

		}

		return result + '</select>';
	},

	input : function (type, tableName, name, value) {
		return '<input type="' + type + '" ' + this.idAndName(tableName, name) + ' value="' + value + '" />';
	},

	idAndName : function (tableName, name) {
		var fullName = tableName + '.' + name;
		return 'id="' + fullName + '" name="' + fullName + '"';
	}
};

