import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    const isValid = await verify(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Невірний пароль.');
    }

    return user;
  }
}
