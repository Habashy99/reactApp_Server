import db from "../sqlite"

db.serialize(() => {
 db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,firstName VARCHAR,lastName VARCHAR,email VARCHAR,password VARCHAR,address VARCHAR )");

});

db.close();