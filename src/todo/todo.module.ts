import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entity/todo.entity';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [TodoController],
  imports: [TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoService, UserService, JwtStrategy],
})
export class TodoModule {}
