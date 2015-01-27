// local storage based db; defines the following variables:
// <tablename> - returns an array with metadata, including:
// - ids - the ids that are in store for this table
// - max id - (optional) the next available id
// - a description of the fields(!)
// - any other useful data, such as description, user added data
// <tablename.id> - returns the object at the given id

var Table =
{
    put : function (table)
    {
        if (!table.ids) {
            table.ids = [];
        }

        if (table.id == "tables") {
            localStorage.setItem(table.id, JSON.stringify(table));
        } else {
            Db.put ("tables", table);
        }
    },

    get : function (tableName)
    {
        var table = (tableName == "tables") ? JSON.parse(localStorage.getItem(tableName)) : Db.get("tables", tableName);

        if (!table) {
            table = { id: tableName };
            this.put(table);
        }
        return table;
    },

    remove : function (tableName)
    {
        Db.remove("tables", tableName);
    },

    list : function ()
    {
        var tables = localStorage.getItem("tables");
        if(!tables) return [];
        return JSON.parse(tables).ids;
    },

    // allows use of table name string as well as already loaded object
    // in Db.put and Db.delete functions
    toObject : function (table)
    {
        if (table.id) return table; else return this.get(table);
    },

    toId : function (table)
    {
        if (table.id) return table.id; else return table;
    }
};

var Db =
{
    listeners : [],

    // If no item.id is defined, it is assumed a numerical should be added.
    put : function (table, item)
    {
        table = Table.toObject(table);

        if (!item.id) {
            item.id = table.ids.length == 0 ? 1 : Math.max.apply(Math, table.ids) + 1;
        }

        var key = table.id + "." + item.id;
        localStorage.setItem(key, JSON.stringify(item));
	if (table.ids.indexOf(item.id) == -1) table.ids.push(item.id);
        Table.put(table);
    },

    get : function (table, item)
    {
        var key = Table.toId(table) + "." + Db.toId(item);
        var item = localStorage.getItem(key);
        if (item) item = JSON.parse(item);
        return item;
    },

    remove : function (table, item)
    {
        var table = Table.toObject(table);
        var id = Db.toId(item);

        localStorage.removeItem(table.id + "." + id);
        table.ids.splice(table.ids.indexOf(id), 1);
        Table.put(table);
    },

    toObject : function (tableName, item)
    {
        if (item.id) return item; else return Db.get(tableName, item);
    },

    toId : function (item)
    {
        if (item.id) return item.id; else return item;
    },
};
