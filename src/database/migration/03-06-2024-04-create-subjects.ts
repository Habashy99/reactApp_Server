import db from "../sqlite"


db.prepare("CREATE TABLE subjects (id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR,time VARCHAR)").run();
db.prepare("CREATE TABLE users_subjects (id INTEGER PRIMARY KEY AUTOINCREMENT,userId INTEGER NOT NULL,subjectId INTEGER NOT NULL,FOREIGN KEY(userId) REFERENCES users(id),FOREIGN KEY(subjectId) REFERENCES subjects(id))").run();

db.close();