import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class EditUserDto extends CreateUserDto {
  @ApiProperty({ example: 1 })
  role: number;
}
