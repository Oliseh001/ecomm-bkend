import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/entities/cart.entity';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { typeOrmConfig } from './config/typeorm.config';
import { CartItem } from './cart/entities/cart-item.entity';
import { Order } from './cart/entities/order.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Cart, CartItem, Order]), // Cart related entities
    AuthModule, // Import UserModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}
