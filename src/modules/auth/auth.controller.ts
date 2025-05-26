import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@decorators/auth/public.decorator';
import { GoogleGuard } from '@guards/google-guard/google-guard.guard';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from '@guards/local-guard/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ApiResponseDto } from '@common/dto/api-response.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { ApiOperationAuto } from '@decorators/swagger/api-operation.decorator';

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
  @Post('register')
  @ApiOperationAuto('Register for user', 'Create a account for this product')
  async register(@Body() payload: RegisterDto) {
    await this.authService.register(payload);
    return new ApiResponseDto(201, 'Register Successfully!');
  }

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperationAuto('Login for user', 'Authenticate user and return JWT token')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any) {
    const response = await this.authService.login(req.user.id as string);
    return new ApiResponseDto(200, 'Login Successfully!', response);
  }

  @Public()
  @Get('google/login')
  @ApiOperationAuto('Login with Google', 'Authenticate user with Google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @ApiOperationAuto(
    'Google callback',
    'Callback from Google, rendirect to client',
  )
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req: any, @Res() res: any) {
    const userId = req.user.id as string;
    const response = await this.authService.login(userId);
    const redirectUrl = `${this.configService.get('FRONTEND_DOMAIN')}?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`;
    res.redirect(redirectUrl);
  }
}
