import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUserid } from './decorators/get-userid.decorator';
import { User } from './entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/Roles.enum';
import { RolesGuard } from './guards/roles.guard';

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

  @Get('whoami')
  @UseGuards(AuthGuard())
  whoAmI(@GetUserid() id: number): Promise<User> {
    return this.usersService.whoAmI(id);
  }
  @Get('whoami/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  whoAmIById(@Param() id: number): Promise<User> {
    return this.usersService.whoAmI(id);
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
