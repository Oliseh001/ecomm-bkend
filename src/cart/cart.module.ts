import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity'; 
import { CartService } from './cart.service';
import { CartRepository, CartItemRepository } from './cart.repository';
import { Order } from './entities/order.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem, Order]), // Register the entities
        AuthModule,
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository, CartItemRepository], // Register the repositories as providers
})
export class CartModule {}