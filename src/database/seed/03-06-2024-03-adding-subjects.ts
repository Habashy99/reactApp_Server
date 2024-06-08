import db from "../sqlite"


const subject1 = db.prepare("INSERT INTO subjects (name,time) VALUES ('arabic','5h')");
const subject2 = db.prepare("INSERT INTO subjects (name,time) VALUES ('german','4h')");

subject1.run();
subject2.run();



db.close();