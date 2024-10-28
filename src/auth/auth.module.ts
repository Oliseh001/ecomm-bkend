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
    // Registering the User entity and UserRepository to allow TypeORM to manage them
    TypeOrmModule.forFeature([User, UserRepository]), 
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuring Passport with JWT strategy
    JwtModule.register({
      secret: 'Vicmanchi01@', // Use environment variable in production
      signOptions: { expiresIn: 3600 }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, // AuthService handles the logic for authentication
    JwtStrategy,  // JwtStrategy is responsible for validating JWTs
    UserRepository, // This can stay if you inject it into other providers like AuthService
  ],
  exports: [
    JwtStrategy, // Export JwtStrategy for use in other modules
    PassportModule, // Export PassportModule to enable guards in other modules
  ],
})
export class AuthModule {}
