import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.userService.getUserWithPassword(email);

    const isValid = await verify(user.password, password);

    if (!isValid) {
      throw new UnauthorizedException('Невірний пароль.');
    }

    return user;
  }

  async login(dto: LoginDto, res: Response, req: Request) {
    const user = await this.validate(dto.email, dto.password);

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.role, req);

    this.setCookie(
      'refresh_token',
      refreshToken,
      res,
      new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    );

    return res.json({ access_token: accessToken });
  }

  async register(dto: RegisterDto, res: Response, req: Request) {
    const newUser = await this.userService.create(dto);

    const { accessToken, refreshToken } = await this.generateTokens(newUser.id, newUser.role, req);

    this.setCookie(
      'refresh_token',
      refreshToken,
      res,
      new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    );

    return res.json({ access_token: accessToken });
  }

  logout(res: Response) {
    res.clearCookie('refresh_token');
    return res.status(200).json({ message: 'Вихід успішний.' });
  }

  async refresh(res: Response, req: Request) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    let refreshPayload: { sub: string; role: Role; userAgent: string };

    try {
      refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
        algorithms: ['HS256'],
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    const userAgent = req.headers['user-agent'];

    if (refreshPayload.userAgent !== userAgent) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      refreshPayload.sub,
      refreshPayload.role,
      req,
    );

    this.setCookie(
      'refresh_token',
      newRefreshToken,
      res,
      new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    );

    return res.json({ access_token: accessToken });
  }

  private setCookie(key: string, token: string, res: Response, expires: Date) {
    res.cookie(key, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires,
    });
  }

  private async generateTokens(sub: string, role: Role, req: Request) {
    const accessToken = await this.jwtService.signAsync(
      { sub, role },
      {
        algorithm: 'HS256',
        expiresIn: '15m',
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub, role, userAgent: req.headers['user-agent'] },
      {
        algorithm: 'HS256',
        expiresIn: '31d',
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }
}
