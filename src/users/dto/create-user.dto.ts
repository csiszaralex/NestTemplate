import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SigninUserDto } from './signin-user.dto';

export class CreateUserDto extends SigninUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Kerek Elek' })
  name: string;
}
