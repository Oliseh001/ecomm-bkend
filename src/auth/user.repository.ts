// user.repository.ts 
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // Method to register a new user
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, password } = authCredentialsDto;

        // Create a new user instance
        const user = new User();
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt); // Hash the password before saving

        try {
            // Save the user to the database
            // await this.userRepository.save(user);
        } catch (error) {
            // Check for duplicate email error
            if (error.code === '23505') { // Duplicate email error code
                throw new ConflictException('Email already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    // Method to validate user credentials
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;

        // Use findOneBy to retrieve the user by email
        const user = await this.userRepository.findOneBy({ email });

        if (user && await user.validatePassword(password)){
            return user.email;
        } else{
            return null;
        }
    }

    // Helper method to hash passwords
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
