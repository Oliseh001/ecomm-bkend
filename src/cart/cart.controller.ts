import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity'; 
import { CartItem } from './entities/cart-item.entity';

@Controller('cart') // Define the route prefix for this controller
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get() // Retrieve the single cart
    async getCart(): Promise<Cart> {
        return this.cartService.getCart(); // Get the current user's cart
    }

    @Post('add-item') // Add an item to the cart
    async addToCart(@Body() item: CartItem): Promise<Cart> {
        return this.cartService.addItemToCart(item); // Add item to the cart
    }

    @Delete('remove-item/:id') // Remove an item from the cart
    async removeItemFromCart(@Param('id') id: number): Promise<Cart> {
        return this.cartService.removeItemFromCart(id); // Remove specified item from the cart
    }

    @Post('confirm') // Confirm the order
    async confirmOrder(): Promise<void> {
        await this.cartService.confirmOrder(); // Confirm the current cart as an order
    }
}
