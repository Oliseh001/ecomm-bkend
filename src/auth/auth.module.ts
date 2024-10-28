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
    
    TypeOrmModule.forFeature([User, UserRepository]), 
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuring Passport with JWT strategy
    JwtModule.register({
      secret: 'Vicmanchi01@', // Use environment variable in production
      signOptions: { expiresIn: 3600 }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, 
    UserRepository, 
  ],
  exports: [
    JwtStrategy, 
    PassportModule, 
  ],
})
export class AuthModule {}
