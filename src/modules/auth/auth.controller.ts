import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@decorators/auth/public.decorator';
import { GoogleGuardGuard } from '@guards/google-guard/google-guard.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/login')
  @UseGuards(GoogleGuardGuard)
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleGuardGuard)
  googleCallback() {}
}
