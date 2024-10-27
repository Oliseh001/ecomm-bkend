import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayLoad } from "./dto/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Vicmanchi01@',
        });
    }

    async validate(payload: JwtPayLoad) {
        const { email } = payload;

        // Use the new method to find the user by email
        const user = await this.userRepository.findUserByEmail(email);
        
        // If the user is not found, throw an error or return null
        if (!user) {
            return null; // or you can throw an error here
        }

        return user; // Return the user if found
    }
}
