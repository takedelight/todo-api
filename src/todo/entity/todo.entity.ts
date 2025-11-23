import { User } from 'src/user/entity/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Priority {
  low = 'Низький',
  high = 'Високий',
}

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  category: string;

  @Column({ type: 'bool', default: false })
  status: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.low,
  })
  priority: Priority;

  @CreateDateColumn()
  createdAt: Date;
}
