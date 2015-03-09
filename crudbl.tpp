--author Stefan Rieken
--title CruDBl
--date March 10th, 2015
--huge CruDBl
In-browser storage database

--newpage
--heading (New) things to explore !
---

o Native app development
---

o Responsive JS front-end development
---

o Local browser storage
---

o EU Cookie directive / NL Cookiewet ?

--newpage
--heading In-browser storage: types & support
---

o IndexedDB (Android 4.4+)
---

o WebSQL (Not in Firefox)
---

--boldon
v Session- & LocalSorage (universal)
--boldon

--newpage
--heading LocalStorage

---

o Store any (string / stringified) data by key
---

o For an infinite time
---

o Easily set up as backend in HTML-based smartphone apps
---

--boldon
= Ideal database for HTML / JS app !
--boldoff

--newpage
--heading DB: Structuring data
---

o Only store JSON objects
---

o Link to table object for meta info
---
  - Name of table
---
  - List of IDs (= keys) of tuples 'in this table'
---
--boldon
  - DDL
--boldoff

--newpage
--heading Structured data: DDL
---

o Define structured data model (DDL) in table object
---

o Data types:
---
  - string, int, date, ...
---
  - stringlist, intlist, datelist, ...
---

o Table relationships:
---
  - 1:1 by using data type 'tablename' and value 'ID'
---
  - 1:N by storing lists of IDs
---

o Lists of inline objects (instead of IDs):
---
  - When list items belong only to this object

--newpage
--heading Generating CRUD dialogs
---

o Data definition becomes model
---
  - Add display hints to DDL
---
--boldon
  - Models are interchangeable
--boldoff
---

o Generate view based on model
---
  - Overview menu; list view; edit view
---
  - Use fancy input types (date, numeric) where possible
---

o Handle actions in controller
---
  - Because otherwise it's not MVC
---

--newpage
--heading That's it !

--beginslidetop
--huge Questions ?
--endslidetop
