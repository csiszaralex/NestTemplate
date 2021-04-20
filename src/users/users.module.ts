import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();
@Module({
  controllers: [UsersController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET || 'niszIsTheBest123',
      signOptions: { expiresIn: process.env.EXPIRES_IN || '1h' },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UsersService, UserRepository, JwtStrategy],
  exports: [UsersModule, JwtStrategy, PassportModule],
})
export class UsersModule {}
