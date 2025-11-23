import { Todo } from 'src/todo/entity/todo.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  user = 'user',
  admin = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @OneToMany(() => Todo, (todo) => todo.user, {
    cascade: true,
  })
  todos?: Todo[];

  @CreateDateColumn()
  createdAt: Date;
}
