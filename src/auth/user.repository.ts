import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
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
  
    /**
     * Sign up a new user
     * @param authCredentialsDto - Data transfer object containing user credentials
     */
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
      const { email, password } = authCredentialsDto;
  
      // Check if the user already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      // Create a new user instance
      const user = new User();
      user.email = email;
      user.salt = await this.generateSalt(); // Generate salt
      user.password = await this.hashPassword(password, user.salt); // Hash the password
  
      try {
        await this.userRepository.save(user); // Save the new user to the database
      } catch (error) {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  
    /**
     * Validate user credentials
     * @param authCredentialsDto - Data transfer object containing user credentials
     * @returns User email if validation is successful, otherwise null
     */
    async validateUserPassword(
      authCredentialsDto: AuthCredentialsDto,
    ): Promise<string> {
      const { email, password } = authCredentialsDto;
  
      const user = await this.userRepository.findOne({ where: { email } });
  
      // Check if user exists and validate password
      if (user && (await user.validatePassword(password))) {
        return user.email; // Return user email if validation succeeds
      } else {
        return null; // Return null if validation fails
      }
    }
  
    /**
     * Find a user by email
     * @param email - Email of the user to be found
     * @returns User entity if found, otherwise null
     */
    async findUserByEmail(email: string): Promise<User | null> {
      return this.userRepository.findOne({ where: { email } });
    }
    async findUsersWithOrders(): Promise<User[]> {
    return await this.userRepository.find({
        relations: ['orders'], // Load user orders
    });
}
  
    /**
     * Hash the user's password
     * @param password - Plain text password
     * @param salt - Salt for hashing
     * @returns Hashed password
     */
    private async hashPassword(password: string, salt: string): Promise<string> {
      return bcrypt.hash(password, salt);
    }
  
    /**
     * Generate salt for password hashing
     * @returns Generated salt
     */
    private async generateSalt(): Promise<string> {
      return bcrypt.genSalt(); // Generate salt using bcrypt
    }
  }
  