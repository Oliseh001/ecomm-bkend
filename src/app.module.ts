import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/cart.entity'; // Adjust the import path
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { typeOrmConfig } from './config/typeorm.config';
import { CartItem } from './cart/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Cart, CartItem]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}