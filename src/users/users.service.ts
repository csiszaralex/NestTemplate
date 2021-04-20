import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { name, email, password, phoneNumber, fullName } = createUserDto;
    await this.userRepository.createUser(name, email, password, phoneNumber, fullName);
    return await this.signinUser({ email, password });
  }

  async signinUser(signinUserDto: SigninUserDto): Promise<{ accessToken: string }> {
    const { email, password } = signinUserDto;
    const user = await this.userRepository.signinUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayloadInterface = {
      id: user.id,
      name: user.name,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async whoAmI(id: number): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    delete user.salt;
    delete user.password;
    return user;
  }

  // setRole(role: Role, id: number, uid: number, uRole: Role) {
  //   return this.userRepository.setRole(role, id, uid, uRole);
  // }
}
