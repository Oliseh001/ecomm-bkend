import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayLoad } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService, // Inject JwtService
    ) {}

    // Method to register a new user
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        try {
            await this.userRepository.signUp(authCredentialsDto); // Attempt to sign up the user
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('User already exists'); // Handle existing user
            }
            throw error; // Propagate other errors
        }
    }

    // Method to validate user credentials and return a JWT
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const userEmail = await this.userRepository.validateUserPassword(authCredentialsDto);
        
        if (!userEmail) {
            throw new UnauthorizedException('Invalid credentials'); // Handle invalid login
        }

        const payload: JwtPayLoad = { email: userEmail };
        const accessToken = this.jwtService.sign(payload); // Sign the payload to create a token

        return { accessToken }; // Return the token
    }
}
