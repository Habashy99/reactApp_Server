import db from "../sqlite"

db.serialize(() => {
    const task1 = db.prepare("INSERT INTO tasks (name,time,userId) VALUES ('makePizza','1h','2')");
    const task2 = db.prepare("INSERT INTO tasks (name,time,userId) VALUES ('makeRoastChicken','2h','1')");

    task1.run();
    task2.finalize();

    task1.run();
    task2.finalize();

});

db.close();