import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Vicmanchi01@',
      signOptions: { 
        expiresIn:  3600,
      },
    }),
    TypeOrmModule.forFeature([User]), // Register the entities
],
  controllers: [AuthController],
  providers: [AuthService, UserRepository]
})
export class AuthModule {}
