import { BaseEntity, Entity, PrimaryGeneratedColumn, Column ,OneToMany} from "typeorm"
import {Task} from './Tasks'

@Entity({name:"users"})
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string
    @Column()
    password:string
    @Column()
    address:string
    @OneToMany(()=>Task,(task)=>task.user)
    tasks:Task[]
}