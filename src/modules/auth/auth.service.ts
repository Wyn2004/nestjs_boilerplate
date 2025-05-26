import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthJwtPayload } from './types/auth-jwt.payload';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { compareString, hashString } from '@utils/auth';
import { MaillerService } from '@modules/mail/mail.service';
import { ValidationException } from '@exceptions/validation.exception';
import { ErrorCode } from '@constants/error-code.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly maillerService: MaillerService,
  ) {}

  async validateGoogleUser(googleUser: CreateUserDto) {
    try {
      const user = await this.userService.findByEmail(googleUser.email);
      if (user) return user;
      const newUser = await this.userService.create(googleUser);
      this.maillerService.sendMailWelcome({
        email: googleUser.email,
        username: googleUser.lastName || '',
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new ValidationException(ErrorCode.U003);
    const isPasswordValid = await compareString(password, user.password);
    if (!isPasswordValid) throw new ValidationException(ErrorCode.U002);
    return user;
  }

  async register(payload: RegisterDto) {
    try {
      const checkExist = await this.userService.findByEmail(payload.email);
      if (checkExist) throw new ValidationException(ErrorCode.U005);

      const hashPassword = await hashString(payload.password);
      payload.password = hashPassword;
      await this.userService.create(payload);
      this.maillerService.sendMailWelcome({
        email: payload.email,
        username: payload.lastName,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    await this.userService.updateRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    try {
      const payload: AuthJwtPayload = { sub: userId };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, this.refreshTokenConfig),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw error;
    }
  }
}
