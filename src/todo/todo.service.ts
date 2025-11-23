import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private readonly userService: UserService,
  ) {}

  async getAllTodo(userId: string, orderBy: FindOptionsOrderValue) {
    return await this.todoRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: orderBy,
      },
    });
  }

  async delete(todoId: string) {
    await this.todoRepository.delete(todoId);
  }

  async create(dto: CreateTodoDto, userId: string) {
    const user = await this.userService.getById(userId);

    const todo = this.todoRepository.create({ ...dto, user });

    await this.todoRepository.save(todo);
  }
}
