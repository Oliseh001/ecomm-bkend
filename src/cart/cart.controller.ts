import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AuthGuard } from '@nestjs/passport'; // Import the AuthGuard

@Controller('cart') // Define the route prefix for this controller
export class CartController {
    constructor(private readonly cartService: CartService) {}


    @Get() // Retrieve the single cart
    async getCart(): Promise<{ message: string; cart: Cart }> {
        const cart = await this.cartService.getCart(); // Get the current user's cart
        return { message: 'Cart retrieved successfully.', cart }; // Return message with cart
    }


    @Post('add-item') // Add an item to the cart
    async addToCart(@Body() item: CartItem): Promise<{ message: string; cart: Cart }> {
        const result = await this.cartService.addItemToCart(item); // Add item to the cart
        return { message: result.message, cart: result.cart }; // Return message with cart
    }


    @Delete('remove-item/:id') // Remove an item from the cart
    async removeItemFromCart(@Param('id') id: number): Promise<{ message: string; cart: Cart }> {
        const result = await this.cartService.removeItemFromCart(id); // Remove specified item from the cart
        return { message: result.message, cart: result.cart }; // Return message with cart
    }

    
    @Post('confirm') // Confirm the order
    @UseGuards(AuthGuard('jwt')) // Ensure user is authenticated
    async confirmOrder(@Request() req): Promise<{ message: string }> {
        const user = req.user; // Extract user from request
        const result = await this.cartService.confirmOrder(user); // Confirm the current cart as an order
        return { message: result.message }; // Return confirmation message with item details
    }
}
