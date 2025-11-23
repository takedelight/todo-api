import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Ім'я користувача має бути рядком." })
  @MinLength(2, { message: "Ім'я користувача має містити щонайменше 2 символи." })
  username: string;

  @IsEmail({}, { message: 'Невірний формат email.' })
  email: string;

  @IsString({ message: 'Пароль користувача має бути рядком.' })
  @MinLength(6, { message: 'Пароль має мати щонайменше 6 символів.' })
  password: string;
}
