import db from "../sqlite"

db.serialize(() => {
    db.run("ALTER TABLE tasks ADD COLUMN isDone BOOLEAN")
});

db.close();