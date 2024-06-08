import "reflect-metadata"
import { DataSource } from "typeorm"
import { Photo } from "./entity/Photos"
import { User } from "./entity/User"
import { Subject } from "./entity/Subjects"
import { Task } from "./entity/Tasks"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./server.db",
    entities: [Photo,Subject,Task,User],
    synchronize: true,
    logging: false,
})