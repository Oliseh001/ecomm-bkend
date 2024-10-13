import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity'; // Assuming Cart entity is defined
import { CartItem } from './cart-item.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Retrieve cart by ID
  @Get(':id')
  async getCart(@Param('id') id: number): Promise<Cart | { message: string }> {
    const cart = await this.cartService.getCart(id);
    return cart;
  }

  // Add item to the cart
  @Post('add-item')
  async addToCart(@Body() item: CartItem): Promise<void> {
    await this.cartService.addItemToCart(item);
  }

  // Remove item from the cart
  @Delete('remove-item/:id')
  async removeItemFromCart(@Param('id') id: number): Promise<void> {
    await this.cartService.removeItemFromCart(id);
  }

  // Confirm the order
  @Post('confirm')
  async confirmOrder(): Promise<void> {
    await this.cartService.confirmOrder();
  }
}