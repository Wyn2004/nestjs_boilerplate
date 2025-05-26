import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['local', 'google'])
  provider?: string = 'local';
}
