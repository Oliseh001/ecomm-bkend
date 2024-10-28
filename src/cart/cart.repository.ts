import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartRepository {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>, // Inject Cart repository
    ) {}

    async findCartWithItems(id: number): Promise<Cart | undefined> {
        return await this.cartRepository.findOne({ where: { id }, relations: ['items'] });
    }
}

@Injectable()
export class CartItemRepository {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>, // Inject CartItem repository
    ) {}
}

