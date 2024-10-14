import { Controller, Get, Post, Body, Delete, Patch, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity'; 
import { CartItem } from './cart-item.entity';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get() // Retrieve the single cart
    async getCart(): Promise<Cart> {
        return this.cartService.getCart();
    }

    @Post('add-item') // Add an item to the cart
    async addToCart(@Body() item: CartItem): Promise<Cart> {
        return this.cartService.addItemToCart(item);
    }

    @Delete('remove-item/:id') // Remove an item from the cart
    async removeItemFromCart(@Param('id') id: number): Promise<Cart> {
        return this.cartService.removeItemFromCart(id);
    }

    @Post('confirm') // Confirm the order
    async confirmOrder(): Promise<void> {
        await this.cartService.confirmOrder();
    }
}