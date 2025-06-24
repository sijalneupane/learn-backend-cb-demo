import { Users2 } from 'src/modules/auth/entity/users2.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text'})
  description: string;

  @Column('simple-array')
  tags: string[];

  @ManyToMany(() => Users2, (users) => users.courses)
  users: Users2[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
