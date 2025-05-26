import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(payload: Record<string, any>) {
    const loginDto = Object.assign(new LoginDto(), payload);
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      throw new UnauthorizedException('Invalid login data');
    }
    return this.authService.validateUser(loginDto.email, loginDto.password);
  }
}
