import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Param,
  Patch,
  Req,
  Put,
} from '@nestjs/common';
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
import { SignInPayloadInterface } from './interfaces/signin-payload.interface';
import { EditUserDto } from './dto/edit-user.dto';
import { GetRole } from './decorators/get-role.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<SignInPayloadInterface> {
    return this.usersService.createUser(createUserDto);
  }
  @Post('signin')
  signIn(@Body(ValidationPipe) signinUserDto: SigninUserDto): Promise<SignInPayloadInterface> {
    return this.usersService.signinUser(signinUserDto);
  }
  @Put('renew')
  @UseGuards(AuthGuard())
  renewUser(@GetUserid() id: number): Promise<SignInPayloadInterface> {
    return this.usersService.renewUser(id);
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
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  getUsers(@GetRole() role: number): Promise<User[]> {
    return this.usersService.getUsers(role);
  }

  @Patch()
  @UseGuards(AuthGuard())
  changeProfile(
    @GetUserid() id: number,
    @Body() editUserDto: EditUserDto,
  ): Promise<SignInPayloadInterface> {
    return this.usersService.changeProfile(id, editUserDto);
  }
  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  changeProfileById(
    @Param() id: number,
    @Body() editUserDto: EditUserDto,
  ): Promise<SignInPayloadInterface> {
    return this.usersService.changeProfile(id, editUserDto);
  }
}
