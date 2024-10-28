import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity'; 
import * as config from 'config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:  process.env.JWT_SECRET || config.get('jwt.secret'),
        });
    }

    async validate(payload: any): Promise<User> {
        const { email } = payload;
        const user = await this.userRepository.findUserByEmail(email); // Ensure this function exists in UserRepository

        if (!user) {
            throw new UnauthorizedException();
        }
        return user; // Return the user object if found
    }
}
