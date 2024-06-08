import {
    BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany,
    JoinTable,
} from "typeorm"
@Entity({name:"subjects"})
export class Subject extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string

    @Column()
    time: string
}