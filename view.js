View = {
	overview : function(tableName) {
		var html = this.menu();
		document.getElementsByTagName("body")[0].innerHTML = html;
	},

	menu : function() {
		var html = '\n<div id="menu">\n';

		var tables = Table.get('tables');
		for (var i in tables.ids) {
			var table = Table.get(tables.ids[i]);
			if (table.local) continue;
			html += '<a href="#" onclick="View.listDialog(\'' + tables.ids[i] + '\')">' + table.names[1] + '</a> \n';
		}

		return html + '</div>';
	},

	listDialog : function(tableName) {
		var html = this.menu() + '<form>';

		var table = Table.get(tableName);
		var rows = this.idsToRows(table, table.ids);
		html += this.listCommon(table, rows, {
			editPart : function () {
				return View.action('=', 'Controller.showMenu()')
                                     + View.action('+', 'View.editDialog(\'' + table.id + '\')');
			},
			movePart : function(index) {
				var html = View.action('-', 'Controller.remove(\'' + table.id + '\', ' + rows[index].id + ')');
				html += View.action('&#8593;', 'Controller.moveRootList(-1, \'' + table.id + '\', ' + index + ')');
				html += View.action('&#8595;', 'Controller.moveRootList( 1, \'' + table.id + '\', ' + index + ')');
				return html;
			},
			addPart : function() { return ''; },
			rootName : function() {
				return tableName;
			}
		});

		html += '</form>';
		document.getElementsByTagName("body")[0].innerHTML = html;
		document.getElementById("menu").style.display='none';
	},

	locallist : function (tableName, rows, parentTable, parentKey, parentId)
	{
		var table = Table.get(tableName);

		return this.listCommon(table, rows, {
			editPart : function () {
				return '&nbsp;';
			},
			movePart : function(index) {
				var html = View.action('-', 'Controller.remove(\'' + tableName + '\', ' + index + ', \'' + parentTable + '\', \'' + parentKey + '\', true)');
				html += View.action('&#8593;', 'Controller.moveChildList(-1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + index + ')');
				html += View.action('&#8595;', 'Controller.moveChildList( 1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + index + ')');
				return html;
			},
			addPart : function() {
				var html = '<tr>';
				for (var key in table.ddl) {
					if (table.ddl[key].display.indexOf('list') > -1) continue;
					var input = View[table.ddl[key].display].apply(View, [table.ddl[key].type, key, '', parentKey]);
					html += '<td><div>' + input + '</div></td>';
				}
				html += '<td><div>' + View.action('+', 'Controller.addToLocalList(\'' + table.id + '\', \'' + parentTable + '\', \'' + parentKey + '\')') + '</div></td></tr>\n';
				return html;
			},
			rootName : function() {
				return parentKey;
			}
		});
	},

	idsToRows : function (table, ids) {
		var rows = [];
		var toRemove = [];
		for (var i in ids) {
			var row = Db.get(table.id, ids[i]);
			if (rows == null) {
				toRemove.push(ids[i]);
			} else {
				rows.push(Db.get(table.id, ids[i]));
			}
		}

		for (var i in toRemove) {
console.log("splicing");
			var id = toRemove[i];
			ids.splice(ids.indexOf(id), 1);
		}

		return rows;
	},

	globallist : function (tableName, ids, parentTable, parentKey, parentId)
	{
		var table = Table.get(tableName);

		return this.listCommon(table, this.idsToRows(table, ids), {
			editPart : function () {
				return '&nbsp;';
			},
			movePart : function(index) {
				var html = View.action('-', 'Controller.remove(\'' + tableName + '\', ' + index + ', \'' + parentTable + '\', \'' + parentKey + '\', false)');
				html += View.action('&#8593;', 'Controller.moveChildList(-1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + index + ')');
				html += View.action('&#8595;', 'Controller.moveChildList( 1, \'' + parentTable + '\', \'' + parentId + '\', \'' + parentKey + '\', ' + index + ')');
				return html;
			},
			addPart : function() {
				var html = '<tr><td colspan="2"><div>';
				html += View.select(table.id, parentKey, '', parentTable + '_add');
				html += View.action('+', 'Controller.addToGlobalList(\'' + table.id + '\', \'' + parentTable + '\', \'' + parentKey + '\')');
				html += '</div></td></tr>';
				return html;
			},
			rootName : function() {
				return parentKey;
			}
		});
	},

	listCommon : function (table, rows, callback)
	{
		parentTable = false;
		var html = '<table><tr>';
		for (var i in table.ddl) {
			if (table.ddl[i].display.indexOf('list') > -1) continue;
			html += '<th><div>' + table.ddl[i].name + '</div></th>';
		}

		html += '<th><div>' + callback.editPart() + '</div></th></tr>\n';
		
		for (var i in rows) {
			html += '<tr>';
			var row = rows[i];

			for (var key in table.ddl) {
				if (table.ddl[key].display.indexOf('list') > -1) continue;
				var value = table.ddl[key].display != 'select' ? row[key] : Db.get(table.ddl[key].type, row[key]).name;
				html += '<td><div><a href="#" onclick="View.editDialog(\'' + table.id + '\',' + table.ids[i] + ')">' + value + '</a></div></td>';
			}
			html += '<td><div>' + callback.movePart(i) + '</div></td></tr>\n';
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
		html += '<table>\n<tr><th class="header" colspan="2"><div>' + table.names[0] + View.action('&#8592;', 'View.listDialog(\'' + tableName + '\')', 'button left');
		html += '<button onclick="return Controller.save(\'' + tableName + '\');">Save</button></div></th></tr>\n';

		for (var key in table.ddl)
		{
			var ddl = table.ddl[key];
			
			if (ddl.display == 'locallist' || ddl.display == 'globallist') {
				var value=row[key] ? row[key] : [];
				var listTableName = ddl.type.substring(0, ddl.type.indexOf('list'));
				html += '<tr><th class="sub" colspan="2"><div>' + ddl.name + '</div></th></tr>';
				html += '<tr><td colspan="2">' + this[ddl.display].apply(this, [listTableName, value, tableName, key, row.id]);
				html +=  this.input("hidden", tableName, key, JSON.stringify(value));
				html += '</td></tr>\n';
			} else {
				var value=row[key] ? row[key] : '';
				// select applicable function based on data type
				var input = this[ddl.display].apply(this, [ddl.type, key, value, tableName]);
				html += '<tr><td><div>' + ddl.name + '</div></td><td><div>' + input + '</div></td></tr>\n';
			}
		}

		var idString = row.id ? ',' + row.id : '';
		html += '</table></form>\n';
		document.getElementsByTagName("body")[0].innerHTML = html;
		document.getElementById("menu").style.display='none';
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
  		// needs a dynamic implementation to properly escape value
		var input = document.createElement("input");
		input.type = type;
		input.id = rootName + '.' + name;
		input.name = rootName + '.' + name;
		var fnark = document.createAttribute('value');
		fnark.value=value;
		input.setAttributeNode(fnark);// value = value;
		var dummy = document.createElement("div");
		dummy.appendChild(input);
		return dummy.innerHTML;
	},

	action : function (value, action, className) {
		if (!className) className = "button";
		return '<a class="' + className + '" href="#" onclick="' + action + '">' + value + '</a>\n';
	},

	idAndName : function (rootName, name) {
		var fullName = rootName + '.' + name;
		return 'id="' + fullName + '" name="' + fullName + '"';
	}
};

