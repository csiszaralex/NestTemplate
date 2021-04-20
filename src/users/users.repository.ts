import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from './enums/Roles.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async createUser(name, email, password): Promise<void> {
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.email = email;
    user.name = name;
    user.salt = salt;
    user.publicRole = 1;
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
      this.logger.verbose(`User ${name} has successfully registered`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ConflictException('Email already exists');
      else {
        this.logger.warn(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async signinUser(email, password): Promise<User> {
    const user = await this.validateUser(email, password);
    this.logger.verbose(`User ${user.name} has successfully signed in`);
    return user;
  }

  async validateUser(email, password): Promise<User> {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundException(`User with ${email} not found`);

    const passwd = await bcrypt.hash(password, user.salt);
    if (!(passwd === user.password)) throw new UnauthorizedException('Wrong password');
    return user;
  }

  async setRole(role: Role, id: number, uid: number, uRole: Role) {
    const user = await User.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (role < uRole) throw new ForbiddenException();
    user.publicRole = role;
    try {
      user.save();
      this.logger.verbose(`User ${uid} chenged ${id}-s role to ${role}`);
    } catch (error) {
      this.logger.warn(error);
      throw new InternalServerErrorException();
    }
  }
}
