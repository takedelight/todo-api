import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невірний формат електроної пошти.' })
  email: string;

  @IsString({ message: 'Пароль користувача має бути рядком.' })
  @MinLength(6, { message: 'Пароль має мати щонайменше 6 символів.' })
  password: string;
}
