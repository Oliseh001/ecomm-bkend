import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Order } from './entities/order.entity'; // Import the Order entity
import { User } from 'src/auth/user.entity';

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
    async addItemToCart(item: CartItem): Promise<{ message: string; cart: Cart }> {
        const cart = await this.getCart(); 
        const existingItem = cart.items.find(cartItem => cartItem.name === item.name); 
    
        if (existingItem) {
            existingItem.quantity += item.quantity; 
            await this.cartRepository.save(cart); 
            console.log(`Updated item ${existingItem.name} quantity to ${existingItem.quantity}.`);
            return { message: `Updated ${existingItem.name} in the cart.`, cart }; 
        } else {
            const newItem = new CartItem(); 
            newItem.name = item.name;
            newItem.quantity = item.quantity;
            newItem.cart = cart; 
            cart.items.push(newItem);
            await this.cartRepository.save(cart); 
            console.log(`Added new item ${newItem.name} to the cart.`);
            return { message: `Added ${newItem.name} to the cart.`, cart }; 
        }
    }
    

    
    // Remove an item from the cart by item ID
    async removeItemFromCart(itemId: number): Promise<{ message: string; cart: Cart }> {
        const itemToRemove = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'], 
        });
    
        if (!itemToRemove) {
            throw new NotFoundException(`Item with ID ${itemId} not found in cart.`);
        }
    
        const cart = itemToRemove.cart; 
    
        itemToRemove.quantity -= 1;
    
        if (itemToRemove.quantity < 1) {
            await this.cartItemRepository.remove(itemToRemove); 
            console.log(`Item with ID ${itemId} removed from cart and database.`);
            return { message: `Item with ID ${itemId} removed from cart.`, cart };
        } else {
            await this.cartItemRepository.save(itemToRemove); 
            console.log(`Item with ID ${itemId} quantity reduced. New quantity: ${itemToRemove.quantity}`);
            return { message: `Item quantity for ID ${itemId} reduced.`, cart };
        }
    }

    

 // Confirm the order and clear the cart
 async confirmOrder(user: User): Promise<{ message: string }> { 
    const cart = await this.getCart(); 

    if (!cart) {
        throw new NotFoundException('Cart not found.');
    }

    if (!cart.items || !Array.isArray(cart.items)) {
        throw new BadRequestException('Cart items are not initialized properly.');
    }

    if (cart.items.length === 0) {
        throw new BadRequestException('Cart is empty. Cannot confirm an empty order.');
    }

    const itemsToSave = cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
    }));

    const newOrder = this.orderRepository.create({
        items: itemsToSave,
        createdAt: new Date(),
        confirmedBy: user,
    });

    await this.orderRepository.save(newOrder);

    // Create a detailed message for the response
    const itemsSummary = itemsToSave.map(item => `${item.quantity} x ${item.name}`).join(', ');
    const confirmationMessage = `Order confirmed successfully. You have ordered: ${itemsSummary}. Cart cleared.`;

    console.log(`Order ID: ${newOrder.id} has been confirmed with the following items:`);
    itemsToSave.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity}`);
    });

    if (cart.items.length > 0) {
        await this.cartItemRepository.remove(cart.items);
    }

    await this.cartRepository.remove(cart); 

    console.log('Cart cleared after order confirmation.');

    return { message: confirmationMessage }; // Return message to the controller
}

}