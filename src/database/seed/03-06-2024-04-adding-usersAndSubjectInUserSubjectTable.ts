import db from "../sqlite"

    const uS1 = db.prepare("INSERT INTO users_subjects (userId,subjectId) VALUES ('1','1')");
    const uS2 = db.prepare("INSERT INTO users_subjects (userId,subjectId) VALUES ('2','1')");
    const uS3 = db.prepare("INSERT INTO users_subjects (userId,subjectId) VALUES ('1','2')");
    const uS4 = db.prepare("INSERT INTO users_subjects (userId,subjectId) VALUES ('2','2')");

    uS1.run();
    uS2.run();
    uS3.run();
    uS4.run();


db.close();