View = {
	overview : function(tableName) {
		var html = this.menu();
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	menu : function() {
		var html = '\n';

		var tables = Table.get('tables');
		for (var i in tables.ids) {
			var table = Table.get(tables.ids[i]);
			if (table.local) continue;
			html += '<a href="#" onclick="View.listDialog(\'' + tables.ids[i] + '\')">' + table.names[1] + '</a> \n';
		}

		return html;
	},

	listDialog : function(tableName) {
		var html = this.menu();

		var table = Table.get(tableName);
		html += this.listCommon(table, table.ids, {
			editPart : function () {
				return '<a href="#" onclick="View.editDialog(\'' + table.id + '\')">[+]</a>\n';
			},
			movePart : function(id) {
				var html = '<a href="#" onclick="Controller.remove(\'' + table.id + '\', ' + id + ')">[-]</a>'
				html += '<a href="#" onclick="Controller.moveRootList(-1, \'' + table.id + '\', ' + id + ')">[^]</a>\n';
				html += '<a href="#" onclick="Controller.moveRootList( 1, \'' + table.id + '\', ' + id + ')">[v]</a>\n';
				return html;
			},
			addPart : function() { return ''; },
			rootName : function() {
				return tableName;
			}
		});

		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	locallist : function (tableName, ids, parentTable, parentKey, parentId)
	{
		var table = Table.get(tableName);
		return this.listCommon(table, ids, {
			editPart : function () {
				return '&nbsp;';
			},
			movePart : function(id) {
				var html = '<a href="#" onclick="Controller.remove(\'' + tableName + '\', ' + id + ', \'' + parentTable + '\', \'' + parentKey + '\', true)">[-]</a>\n';
				html += '<a href="#" onclick="Controller.moveChildList(-1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + id + ')">[^]</a>\n';
				html += '<a href="#" onclick="Controller.moveChildList(1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + id + ')">[v]</a>\n';
				return html;
			},
			addPart : function() {
				var html = '<tr>';
				for (var key in table.ddl) {
					if (table.ddl[key].display.indexOf('list') > -1) continue;
					var input = View[table.ddl[key].display].apply(View, [table.ddl[key].type, key, '', parentKey]);
					html += '<td>' + input + '</td>';
				}
				html += '<td><a href="#" onclick="Controller.addToLocalList(\'' + table.id + '\', \'' + parentTable + '\', \'' + parentKey + '\')">[+]</a></tr>\n';
				return html;
			},
			rootName : function() {
				return parentKey;
			}
		});
	},

	globallist : function (tableName, ids, parentTable, parentKey, parentId)
	{
		var table = Table.get(tableName);

		return this.listCommon(table, ids, {
			editPart : function () {
				return '&nbsp;';
			},
			movePart : function(id) {
				var html = '<a href="#" onclick="Controller.remove(\'' + tableName + '\', ' + id + ', \'' + parentTable + '\', \'' + parentKey + '\', false)">[-]</a>\n';
				html += '<a href="#" onclick="Controller.moveChildList(-1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + id + ')">[^]</a>\n';
				html += '<a href="#" onclick="Controller.moveChildList(1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + id + ')">[v]</a>\n';
				return html;
			},
			addPart : function() {
				var html = '<tr><td colspan="2">';
				html += View.select(table.id, parentKey, '', parentTable + '_add');
				html += '<a href="#" onclick="Controller.addToGlobalList(\'' + table.id + '\', \'' + parentTable + '\', \'' + parentKey + '\')">[+]</a></tr>\n';
				return html;
			},
			rootName : function() {
				return parentKey;
			}
		});
	},

	listCommon : function (table, ids, callback)
	{
		parentTable = false;
		var html = '<table><tr>';
		for (var i in table.ddl) {
			if (table.ddl[i].display.indexOf('list') > -1) continue;
			html += '<th>' + table.ddl[i].name + '</th>';
		}

		html += '<th>' + callback.editPart() + '</th></tr>\n';
		
		var toRemove = [];
		for (var i in ids) {
			html += '<tr>';
			var row = Db.get(table.id, ids[i]);

			// delete dangling reference on sight
			if (row == null) {
				 toRemove.push(ids[i]);
				 continue;
			}

			for (var key in table.ddl) {
				if (table.ddl[key].display.indexOf('list') > -1) continue;
				var value = table.ddl[key].display != 'select' ? row[key] : Db.get(table.ddl[key].type, row[key]).name;
				html += '<td><a href="#" onclick="View.editDialog(\'' + table.id + '\',' + table.ids[i] + ')">' + value + '</a></td>';
			}
			html += '<td>' + callback.movePart(ids[i]) + '</td></tr>\n';
		}

		for (var i in toRemove) {
console.log("splicing");
			var id = toRemove[i];
			ids.splice(ids.indexOf(id), 1);
		}

		html += callback.addPart();
		html += '</table>';
		return html;
	},

	editDialog : function (tableName, id)
	{
		var table = Table.get(tableName);
		var row = id ? Db.get(tableName, id) : {};

		this.edit(tableName, row);
	},

	edit : function (tableName, row)
	{
		var table = Table.get(tableName);

		var html = this.menu();
		html += '<form id="form">\n';
		if (row.id) html += this.input("hidden", tableName, "id", row.id);
		html += '<table>\n<tr colspan="2"><th>' + table.names[0] + '</th></tr>\n';

		for (var key in table.ddl)
		{
			var ddl = table.ddl[key];
			
			if (ddl.display == 'locallist' || ddl.display == 'globallist') {
				var value=row[key] ? row[key] : [];
				var listTableName = ddl.type.substring(0, ddl.type.indexOf('list'));
				html += '<tr><td colspan="2">' + ddl.name + '</th></tr>';
				html += '<tr><td colspan="2">' + this[ddl.display].apply(this, [listTableName, value, tableName, key, row.id]);
				html +=  this.input("hidden", tableName, key, JSON.stringify(value));
				html += '</td></tr>\n';
			} else {
				var value=row[key] ? row[key] : '';
				// select applicable function based on data type
				var input = this[ddl.display].apply(this, [ddl.type, key, value, tableName]);
				html += '<tr><td>' + ddl.name + '</td><td>' + input + '</td></tr>\n';
			}
		}

		var idString = row.id ? ',' + row.id : '';
		html += '</table><button onclick="return Controller.save(\'' + tableName + '\');">Save</button></form>\n';
		html += '<a href="#" onclick="View.listDialog(\'' + tableName + '\')">[&lt;-]</a>\n';
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	entry : function (type, name, value, rootName)
	{
		return this.input ("text", rootName, name, value);
	},

	select : function (tableName, name, value, rootName)
	{
                var table = Table.get(tableName);
		var result = '<select ' + this.idAndName(rootName, name) + '>\n';
		for (var i in table.ids) {
			var row = Db.get(tableName, table.ids[i]);
			var thisValue = row.name; // ddl.displayName ? 'todo' : row.name;
			var selected = thisValue == value ? ' selected="true"' : '';
			result += '<option value="' + row.id + '"' + selected + '>' + thisValue +'</option>\n';
		}

		return result + '</select>\n';
	},

	input : function (type, rootName, name, value) {
		return '<input type="' + type + '" ' + this.idAndName(rootName, name) + ' value="' + value + '" />';
	},

	idAndName : function (rootName, name) {
		var fullName = rootName + '.' + name;
		return 'id="' + fullName + '" name="' + fullName + '"';
	}
};

