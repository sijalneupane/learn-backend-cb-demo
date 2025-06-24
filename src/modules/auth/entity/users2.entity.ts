import { Entity, JoinTable, ManyToMany } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Role } from "../enum/role.enum";
import { Course } from "src/modules/course/entity/course.entity";

@Entity()
export class Users2 {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;
    
    @Column()
    password: string;
    
    @ManyToMany(() => Course, (course) => course.users)
    @JoinTable({ name: 'users2_course' })
    courses: Course[];
}