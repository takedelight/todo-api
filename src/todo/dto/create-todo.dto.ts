import { IsString } from 'class-validator';
import { Priority } from '../entity/todo.entity';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  priority: Priority;

  @IsString()
  category: string;
}
