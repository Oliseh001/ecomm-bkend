import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository'; // Make sure the path is correct
import { User } from './user.entity'; // Ensure this path is correct

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Vicmanchi01@',
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
