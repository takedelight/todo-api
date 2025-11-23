import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import type { FindOptionsOrderValue } from 'typeorm';

@Controller('todo')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  async create(@Body() dto: CreateTodoDto, @Req() req: Request) {
    return await this.todoService.create(dto, req.user.sub);
  }

  @Get('')
  async getAllUserTodo(@Req() req: Request, @Query('order_by') orderBy: FindOptionsOrderValue) {
    return await this.todoService.getAllTodo(req.user.sub, orderBy);
  }

  @Delete('/delete:id')
  async delete(@Param('id') id: string) {
    return await this.todoService.delete(id);
  }
}
