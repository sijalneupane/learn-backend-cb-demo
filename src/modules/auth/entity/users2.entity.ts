import { Entity, JoinTable, ManyToMany } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users2 {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
    
//     @ManyToMany(() => Courses, (course) => course.users2)
//     @JoinTable({ name: 'users2_courses' })
//     courses: Courses[];
}