import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository'; // Ensure correct path
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity'; // Ensure correct path

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]), // Register User and UserRepository
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Vicmanchi01@',
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy], // UserRepository is not needed here; it’s injected directly into AuthService
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
