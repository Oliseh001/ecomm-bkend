import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity'; // Make sure to import the Cart entity
import { CartItem } from './cart-item.entity'; // Make sure to import the CartItem entity
import { CartService } from './cart.service';
import { CartRepository, CartItemRepository } from './cart.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem]), // Register the entities
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository, CartItemRepository], // Register the repositories as providers
})
export class CartModule {}