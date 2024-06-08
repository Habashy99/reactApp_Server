import db from "../sqlite"

db.serialize(() => {
    const user1 = db.prepare("INSERT INTO users (firstName,lastName,email,password,address) VALUES ('bodi','habashy','habashy@yahoo.com','habashy1a','alex')");
    const user2 = db.prepare("INSERT INTO users (firstName,lastName,email,password,address) VALUES ('mohamed','habashy','mohamedhabashy@yahoo.com','habashy1a','alex')");

    user1.run();
    user2.finalize();

    user1.run();
    user2.finalize();

});

db.close();