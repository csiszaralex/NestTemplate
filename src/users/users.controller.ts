import { Controller, Post, Body, ValidationPipe, Patch, UseGuards, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './enums/Roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUserid } from './decorators/get-userid.decorator';
import { GetRole } from './decorators/get-role.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('signin')
  signIn(@Body(ValidationPipe) signinUserDto: SigninUserDto): Promise<{ accessToken: string }> {
    return this.usersService.signinUser(signinUserDto);
  }

  // @Patch(':id')
  // @UseGuards(AuthGuard())
  // setRole(
  //   @Body('role') role: Role,
  //   @Param('id') id: number,
  //   @GetUserid() uid: number,
  //   @GetRole() uRole: Role,
  // ) {
  //   return this.usersService.setRole(role, id, uid, uRole);
  // }
}
