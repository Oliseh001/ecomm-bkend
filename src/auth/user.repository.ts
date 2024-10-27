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

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, password } = authCredentialsDto;

        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user = new User();
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;

        const user = await this.userRepository.findOneBy({ email });

        if (user && await user.validatePassword(password)) {
            return user.email;
        } else {
            return null;
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
