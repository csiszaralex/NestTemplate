import { EntityRepository, LessThan, Repository } from 'typeorm';
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

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async createUser(name, email, password, phoneNumber, fullName): Promise<void> {
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.email = email;
    user.name = name;
    user.salt = salt;
    user.role = 1;
    user.phoneNumber = phoneNumber ? phoneNumber : null;
    user.fullName = fullName;
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
      this.logger.verbose(`User ${name} has successfully registered`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Email or phonenumber already exists');
      this.logger.warn(error);
      throw new InternalServerErrorException();
    }
  }
  async signinUser(email, password): Promise<User> {
    const user = await this.validateUser(email, password);
    user.signedIn = new Date();

    try {
      this.logger.verbose(`User ${user.name} has successfully signed in`);
      user.save();
      return user;
    } catch (err) {
      this.logger.warn(err);
      throw new InternalServerErrorException(err);
    }
  }
  async validateUser(email, password): Promise<User> {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundException(`User with ${email} not found`);
    if (user.role < 0) throw new ForbiddenException('Tiltás');
    const passwd = password.match(/^\$2b\$10\$/)
      ? password
      : await bcrypt.hash(password, user.salt);
    if (!(passwd === user.password)) throw new UnauthorizedException('Wrong password');
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await User.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }
  async getUsers(role: number): Promise<User[]> {
    let users = await User.find({
      where: { role: LessThan(role) },
      select: ['id', 'name', 'email', 'createdAt', 'signedIn', 'role'],
    });
    users = users.filter(user => user.role >= 0);
    return users;
  }

  async changeProfile(
    id: number,
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    fullName: string,
    role: number,
    myRole?: number,
  ) {
    const user = await this.getUserById(id);
    if (myRole && myRole < user.role) throw new ForbiddenException();
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.password = password ? bcrypt.hashSync(password, user.salt) : user.password;
    user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
    user.fullName = fullName ? fullName : user.fullName;
    if (role && role > myRole) throw new ForbiddenException();
    user.role = role ? role : user.role;
    try {
      await user.save();
      this.logger.verbose(`User ${user.name} has successfully changed his profile`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Email or phonenumber already exists');
      this.logger.warn(error);
      throw new InternalServerErrorException();
    }
    return user;
  }
  async deleteProfile(id: number): Promise<void> {
    const user = await this.getUserById(id);
    try {
      await user.remove();
      this.logger.verbose(`User ${user.name} has successfully deleted his profile`);
      return;
    } catch (error) {
      this.logger.warn(error);
      throw new InternalServerErrorException();
    }
  }
}
