import db from "../sqlite"

db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR,time VARCHAR ,userId INTEGER NOT NULL,FOREIGN KEY(userId) REFERENCES users(id))");

});

db.close();