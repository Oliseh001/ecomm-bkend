import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Order } from './entities/order.entity'; // Import the Order entity

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>, // Repository for Cart entity
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>, // Repository for CartItem entity
        @InjectRepository(Order) // Inject the Order repository
        private orderRepository: Repository<Order>, // Repository for Order entity
    ) {}

    // Retrieve or create the single cart
    async getCart(): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: {},  // Add selection criteria here if necessary
            relations: ['items'], // Include related items
        });

        if (!cart) {
            const newCart = this.cartRepository.create(); // Create a new cart if none exists
            return await this.cartRepository.save(newCart); // Save and return the new cart
        }
        
        return cart; // Return the existing cart
    }

    // Add or update an item in the cart
    async addItemToCart(item: CartItem): Promise<Cart> {
        const cart = await this.getCart(); // Retrieve the current cart
        const existingItem = cart.items.find(cartItem => cartItem.name === item.name); // Check for existing item

        if (existingItem) {
            existingItem.quantity += item.quantity; // Update quantity if item already exists
            await this.cartItemRepository.save(existingItem); // Save updated item
        } else {
            const newItem = this.cartItemRepository.create(item); // Create new item
            newItem.cart = cart; // Associate with the cart
            cart.items.push(newItem); // Add new item to the cart's items array
            await this.cartItemRepository.save(newItem); // Save new item
        }

        return await this.cartRepository.save(cart); // Save and return the updated cart
    }

    // Remove an item from the cart by item ID
    // Remove an item from the cart by item ID
    async removeItemFromCart(itemId: number): Promise<Cart> {
        const itemToRemove = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'], // Load the cart relationship
        });

        if (!itemToRemove) {
            throw new NotFoundException(`Item with ID ${itemId} not found in cart.`);
        }

        const cart = itemToRemove.cart; // Get the associated cart

        // Reduce the quantity of the item
        itemToRemove.quantity -= 1;

        if (itemToRemove.quantity < 1) {
            // If quantity is less than 1, remove item from the cart and database
            await this.cartItemRepository.remove(itemToRemove); // Remove from the repository
            console.log(`Item with ID ${itemId} removed from cart and database.`);
        } else {
            // Otherwise, just save the updated item quantity
            await this.cartItemRepository.save(itemToRemove); // Save updated item
            console.log(`Item with ID ${itemId} quantity reduced. New quantity: ${itemToRemove.quantity}`);
        }

        return await this.cartRepository.save(cart); // Save and return the updated cart
    }

    // Confirm the order and clear the cart
    async confirmOrder(): Promise<void> {
    const cart = await this.getCart(); // Ensure this function fetches the cart correctly

    // Check if cart is found
    if (!cart) {
        throw new NotFoundException('Cart not found.');
    }

    // Ensure items property is defined and is an array
    if (!cart.items || !Array.isArray(cart.items)) {
        throw new BadRequestException('Cart items are not initialized properly.');
    }

    // Check if the cart is empty
    if (cart.items.length === 0) {
        throw new BadRequestException('Cart is empty. Cannot confirm an empty order.');
    }

    // Prepare items to save as an order
    const itemsToSave = cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
    }));

    // Create and save the new order
    const newOrder = this.orderRepository.create({
        items: itemsToSave,
        createdAt: new Date(),
    });

    await this.orderRepository.save(newOrder);

    console.log(`Order ID: ${newOrder.id} has been confirmed with the following items:`);
    itemsToSave.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity}`);
    });

    // Delete all items associated with the cart before deleting the cart itself
    if (cart.items.length > 0) {
        await this.cartItemRepository.remove(cart.items); // Remove all cart items first
    }

    await this.cartRepository.remove(cart); // Now remove the cart

    console.log('Cart cleared after order confirmation.');
}
}