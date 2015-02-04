var model =
{
    "contacts" :
    {
	names : ["Contact", "Contacts", "A list of contacts"],
	ddl :
	{
		firstName : {name : "First name", type : "string", display : "entry" },
		lastName :  {name : "Last name", type : "string", display : "entry" },
		contactType : {name : "Contact type", type : "contactType", display : "select", editable : "false" },
		infos : {name : "Info data", type : "infolist", display : "locallist"},
		companies : {name : "Companies", type : "companylist", display : "globallist"}
	},
	displayName : "{lastName}, {firstName}" // doesn't do anything yet
    },
    "contactType" :
    {
	names : ["Contact type", "Contact types", "Contact types"],
	ddl :
	{
		name : {name : "Type", type : "string", display : "entry"}
	}
    },
    "info" :
    {
	names : ["Contact info", "Contact infos", "Contact infos"],
	ddl :
	{
		type : {name : "Info type", type : "infoType", display : "select", editable : "false" },
		value : {name : "Value", type: "string", display : "entry" }
	},
	displayName : "{type} : {value}",
	local : true // disable this to show all the infos in the main menu
    },
    "infoType" :
    {
	names : ["Info type", "Info types", "Info types"],
	ddl :
	{
		name : {name : "name", type : "string", display : "entry" }
	}
    },
    "company" :
    {
	names : ["Company", "Companies", "Companies"],
	ddl :
	{
		name : {name : "name", type : "string", display : "entry"}
	}
    },
};

