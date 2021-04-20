import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { config } from 'dotenv';
config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'niszIsTheBest123',
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    const { email } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(`No user with email ${email}`);
    }

    return {
      id: user.id,
      name: user.name,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}
