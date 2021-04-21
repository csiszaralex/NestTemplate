import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SigninUserDto } from './signin-user.dto';

export class CreateUserDto extends SigninUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'elek32' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Kerek Elek' })
  fullName: string;

  @ApiProperty({ example: '+36201313123' })
  phoneNumber: string;
}
