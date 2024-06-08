import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, JoinColumn } from "typeorm"
import { User } from "./User"
@Entity({name:"tasks"})
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    time: string
    @Column()
    isDone: boolean
    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: "userId" })
    user: User

    @RelationId((task: Task) => task.user)
    userId: number
}