import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module'; // Import CartModule
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule, // Import AuthModule
    CartModule, // Import CartModule for cart related functionalities
  ],
})
export class AppModule {}
