import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { Role } from './enums/Roles.enum';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { name, email, password } = createUserDto;
    await this.userRepository.createUser(name, email, password);
    return await this.signinUser({ email, password });
  }

  async signinUser(signinUserDto: SigninUserDto): Promise<{ accessToken: string }> {
    const { email, password } = signinUserDto;
    const user = await this.userRepository.signinUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayloadInterface = {
      email: user.email,
      id: user.id,
      publicRole: user.publicRole,
      name: user.name,
    };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  setRole(role: Role, id: number, uid: number, uRole: Role) {
    return this.userRepository.setRole(role, id, uid, uRole);
  }
}
