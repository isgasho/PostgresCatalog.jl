var documenterSearchIndex = {"docs":
[{"location":"#PostgresCatalog.jl-1","page":"Home","title":"PostgresCatalog.jl","text":"","category":"section"},{"location":"#Overview-1","page":"Home","title":"Overview","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"PostgresCatalog is a Julia library for introspecting Postgres databases and generating models of the database structure.","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Use the Julia package manager.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> using Pkg\njulia> Pkg.add(\"PostgresCatalog\")","category":"page"},{"location":"#Usage-Guide-1","page":"Home","title":"Usage Guide","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We will demonstrate how to use PostgresCatalog on a sample database schema containing a single table individual.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using LibPQ\n\nconn = LibPQ.Connection(\"\")\n\nexecute(conn, \"BEGIN\")\n\nexecute(conn,\n        \"\"\"\n        CREATE TYPE individual_sex_enum AS ENUM ('male', 'female', 'other', 'unknown');\n\n        CREATE TABLE individual (\n            id int4 NOT NULL,\n            mrn text NOT NULL,\n            sex individual_sex_enum NOT NULL DEFAULT 'unknown',\n            mother_id int4,\n            father_id int4,\n            CONSTRAINT individual_uk UNIQUE (id),\n            CONSTRAINT individual_pk PRIMARY KEY (mrn),\n            CONSTRAINT individual_mother_fk FOREIGN KEY (mother_id) REFERENCES individual (id),\n            CONSTRAINT individual_father_fk FOREIGN KEY (father_id) REFERENCES individual (id)\n        );\n        \"\"\")","category":"page"},{"location":"#","page":"Home","title":"Home","text":"To generate a model of the database structure, we use function PostgresCatalog.introspect, which returns a PostgresCatalog.PGCatalog object.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using PostgresCatalog\n\ncat = PostgresCatalog.introspect(conn)\n#-> DATABASE \" … \"","category":"page"},{"location":"#","page":"Home","title":"Home","text":"By traversing the catalog, we can obtain the models of database tables, which are represented as PostgresCatalog.PGTable objects.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scm = cat[\"public\"]\n#-> SCHEMA \"public\"\n\ntbl = scm[\"individual\"]\n#-> TABLE \"individual\"","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The table model contains information about its columns in the form of PostgresCatalog.PGColumn objects.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"foreach(println, tbl)\n#=>\nCOLUMN \"individual\".\"id\" \"int4\" NOT NULL\nCOLUMN \"individual\".\"mrn\" \"text\" NOT NULL\nCOLUMN \"individual\".\"sex\" \"individual_sex_enum\" NOT NULL\nCOLUMN \"individual\".\"mother_id\" \"int4\" NULL\nCOLUMN \"individual\".\"father_id\" \"int4\" NULL\n=#","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Properties of a table column are available as attributes on the corresponding model object.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"col = tbl[\"sex\"]\n#-> COLUMN \"individual\".\"sex\" \"individual_sex_enum\" NOT NULL\n\ncol.name\n#-> \"sex\"\n\ncol.type_\n#-> TYPE \"individual_sex_enum\"\n\ncol.not_null\n#-> true\n\ncol.default\n#-> \"'unknown'::individual_sex_enum\"","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Description of unique and foreign key constraints defined on the table is also available in the form of PostgresCatalog.PGUniqueKey and PostgresCatalog.PGForeignKey objects.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"tbl.primary_key\n#-> CONSTRAINT \"individual\".\"individual_pk\" PRIMARY KEY (\"mrn\")\n\nforeach(println, tbl.unique_keys)\n#=>\nCONSTRAINT \"individual\".\"individual_pk\" PRIMARY KEY (\"mrn\")\nCONSTRAINT \"individual\".\"individual_uk\" UNIQUE (\"id\")\n=#\n\nforeach(println, tbl.foreign_keys)\n#=>\nCONSTRAINT \"individual\".\"individual_father_fk\" FOREIGN KEY (\"father_id\") REFERENCES \"individual\" (\"id\")\nCONSTRAINT \"individual\".\"individual_mother_fk\" FOREIGN KEY (\"mother_id\") REFERENCES \"individual\" (\"id\")\n=#","category":"page"},{"location":"#API-Reference-1","page":"Home","title":"API Reference","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"PostgresCatalog.introspect\nPostgresCatalog.PGCatalog\nPostgresCatalog.PGSchema\nPostgresCatalog.PGType\nPostgresCatalog.PGTable\nPostgresCatalog.PGColumn\nPostgresCatalog.PGUniqueKey\nPostgresCatalog.PGForeignKey","category":"page"},{"location":"#PostgresCatalog.introspect","page":"Home","title":"PostgresCatalog.introspect","text":"introspect(conn::LibPQ.Connection) :: PGCatalog\n\nIntrospects a Postgres database and generates a model of the database structure.\n\n\n\n\n\n","category":"function"},{"location":"#PostgresCatalog.PGCatalog","page":"Home","title":"PostgresCatalog.PGCatalog","text":"Model of a Postgres database.\n\nname: name of the database;\nschemas: collection of schemas owned by the database.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGSchema","page":"Home","title":"PostgresCatalog.PGSchema","text":"Model of a database schema.\n\ncatalog: database that owns the schema;\nname: name of the schema;\ncomment: comment on the schema;\ntype: collection of types owned by the schema;\ntables: collection of tables owned by the schema.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGType","page":"Home","title":"PostgresCatalog.PGType","text":"Model of a type.\n\nschema: schema that owns the type;\nname: name of the type;\nlabels: vector of labels for an ENUM type; nothing otherwise;\ncomment: comment on the type;\ncolumns: set of columns of this type.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGTable","page":"Home","title":"PostgresCatalog.PGTable","text":"Model of a table.\n\nschema: schema that owns the table;\nname: name of the table;\ncomment: comment on the table;\ncolumns: collection of table columns;\nprimary_key: primary key of the table, if any;\nunique_keys: collection of unique keys defined on the table;\nforeign_keys: collection of foreign keys defined on the table;\nreferring_foreign_keys: set of foreign keys that refer to this table.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGColumn","page":"Home","title":"PostgresCatalog.PGColumn","text":"Model of a column.\n\ntable: table that owns the column;\nname: name of the column;\ntype_: type of the column;\nnot_null: set if the column has NOT NULL constraint;\ndefault: SQL expression that calculates the default column value; or nothing;\nunique_keys: set of unique keys that include this columns;\nforeign_keys: set of foreign keys that include this column;\nreferring_foreign_keys: set of foreign keys that target this column.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGUniqueKey","page":"Home","title":"PostgresCatalog.PGUniqueKey","text":"Model of a unique key constraint.\n\ntable: table that owns the key;\nname: name of the constraint;\ncolumns: columns included to the key;\nprimary: set if this is the primary key;\ncomment: comment on the constraint.\n\n\n\n\n\n","category":"type"},{"location":"#PostgresCatalog.PGForeignKey","page":"Home","title":"PostgresCatalog.PGForeignKey","text":"Model of a foreign key constraint.\n\ntable: table that owns the key;\nname: name of the constraint;\ncolumns: columns included to the key;\ntarget_table: table targeted by the key;\ntarget_columns: columns targeted by the key;\non_delete: ON DELETE action;\non_update: ON UPDATE action;\ncomment: comment on the constraint.\n\n\n\n\n\n","category":"type"}]
}
