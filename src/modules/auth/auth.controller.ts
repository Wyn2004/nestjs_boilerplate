import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@decorators/auth/public.decorator';
import { GoogleGuardGuard } from '@guards/google-guard/google-guard.guard';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('google/login')
  @UseGuards(GoogleGuardGuard)
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleGuardGuard)
  async googleCallback(@Req() req: any, @Res() res: any) {
    const userId = req.user.id as string;
    const response = await this.authService.login(userId);
    const redirectUrl = `${this.configService.get('FRONTEND_DOMAIN')}?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`;
    res.redirect(redirectUrl);
  }
}
