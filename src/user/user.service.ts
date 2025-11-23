import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  private readonly userSelect = {
    id: true,
    role: true,
    createdAt: true,
    username: true,
    email: true,
  };

  async getAll() {
    return await this.userRepository.find({
      select: this.userSelect,
    });
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('Користувача з таким email не існує.');
    }

    return user;
  }

  async getUserWithPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { ...this.userSelect, password: true },
    });

    if (!user) {
      throw new NotFoundException('Користувача з таким email не існує.');
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('Користувача з таким id не існує.');
    }

    return user;
  }

  async delete(id: string) {
    const user = await this.getById(id);

    await this.userRepository.delete(user.id);

    return { message: 'Користувача видалено.' };
  }

  async create(dto: CreateUserDto) {
    const isExist = await this.userRepository.findOne({ where: { email: dto.email } });

    if (isExist) {
      throw new ConflictException('Користувач з такою електроною поштою вже існує.');
    }

    const user = this.userRepository.create({ ...dto, password: await hash(dto.password) });

    await this.userRepository.save(user);

    return user;
  }
}
