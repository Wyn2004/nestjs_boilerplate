import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { convertToSeconds, hashString } from '@utils/auth';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRedis()
    private redis: Redis,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async findAll() {
    const reponse = await this.userRepository.find();
    return reponse;
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    return plainToInstance(ResponseUserDto, user);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const refreshTokenTtl = this.configService.get(
        'refresh-jwt.expiresIn',
      ) as string;

      const hashedRefreshToken = await hashString(refreshToken);
      const refreshTokenTtlInSeconds = convertToSeconds(refreshTokenTtl);
      await this.redis.set(
        `RT_${userId}`,
        hashedRefreshToken,
        'EX',
        refreshTokenTtlInSeconds,
      );
    } catch (error) {
      console.error('Error updating refresh token:', error);
      throw error;
    }
  }

  async getRefreshToken(userId: string) {
    const refreshToken = await this.redis.get(`RT_${userId}`);
    return refreshToken;
  }

  async deleteRefreshToken(userId: string) {
    await this.redis.del(`RT_${userId}`);
  }
}
