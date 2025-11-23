import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto, @Res() res: Response, @Req() req: Request) {
    return await this.authService.register(dto, res, req);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response, @Req() req: Request) {
    return await this.authService.login(dto, res, req);
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Post('/refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    return await this.authService.refresh(res, req);
  }
}
