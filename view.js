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
			html += '<a href="#" onclick="View.listDialog(\'' + tables.ids[i] + '\')">' + table.names[1] + '</a> ';
		}

		return html;
	},

	listDialog : function(tableName) {
		var table = Table.get(tableName);

		var html = this.menu();
		html += '<table><tr>';
		for (var i in table.ddl) {
			html += '<th>' + table.ddl[i].name + '</th>';
		}
		html += '</tr>';

		for (var i in table.ids) {
			html += '<tr>';
			var row = Db.get(tableName, table.ids[i]);
			for (var key in table.ddl) {
				var value = table.ddl[key].display != 'select' ? row[key] : Db.get(table.ddl[key].type, table.ids[i]).name;
				html += '<td><a href="#" onclick="View.editDialog(\'' + tableName + '\',' + table.ids[i] + ')">' + value + '</a></td>';
			}
			html += '</tr>';
		}

		html += '</table>';

		html += '<a href="#" onclick="View.editDialog(\'' + tableName + '\')">[+]</a>';
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	editDialog : function (tableName, id)
	{
		var table = Table.get(tableName);
		var row = id ? Db.get(tableName, id) : {};

		var html = this.menu();
		html += '<form id="form"><table><tr colspan="2"><th>' + name + '</th></tr>';

		for (var key in table.ddl)
		{
			var ddl = table.ddl[key];
			var value=row[key] ? row[key] : '';
			var input = this[ddl.display].apply(this, [ddl, key, value]);
			html += '<tr><td>' + ddl.name + '</td><td>' + input + '</td></tr>';
		}

		var idString = id ? ',' + id : '';
		html += '</table><button onclick="return Controller.save(\'' + tableName + '\'' + idString + ');">Save</button></form>';
		html += '<a href="#" onclick="View.listDialog(\'' + tableName + '\')">[&lt;-]</a>';
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	entry : function (ddl, name, value)
	{
		return '<input type="text" name="' + name + '" value="' + value + '" />';
	},

	select : function (ddl, name, value)
	{
		var table = Table.get(ddl.type);

		var result = '<select name="' + name + '">';
		for (var i in table.ids) {
			var row = Db.get(ddl.type, table.ids[i]);
			var thisValue = ddl.displayName ? 'todo' : row.name;
			var selected = thisValue == value ? ' selected="true"' : '';
			result += '<option value="' + row.id + '"' + selected + '>' + thisValue +'</option>';

		}

		return result + '</select>';
	}
};

