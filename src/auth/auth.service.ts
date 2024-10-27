import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository'; // Import your UserRepository directly
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository // Inject UserRepository directly
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);

    }

    async signIn(authCredentialsDto: AuthCredentialsDto){
        const email = await this.userRepository.validateUserPassword(authCredentialsDto);

        if(!email){
            throw new UnauthorizedException('Invalid Credentials')
        }
    }
}
