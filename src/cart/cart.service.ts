import { Injectable, NotFoundException } from '@nestjs/common';
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
    async removeItemFromCart(itemId: number): Promise<Cart> {
        const itemToRemove = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'], // Load the cart relationship
        });

        if (!itemToRemove) {
            throw new NotFoundException('Item not found in cart'); // Handle case where item doesn't exist
        }

        const cart = itemToRemove.cart; // Get the associated cart
        cart.items = cart.items.filter(item => item.id !== itemId); // Remove item from cart's items array
        
        await this.cartItemRepository.remove(itemToRemove); // Remove item from the repository
        return await this.cartRepository.save(cart); // Save and return the updated cart
    }

    // Confirm the order and save it to the database
    async confirmOrder(): Promise<void> {
        const cart = await this.getCart(); // Retrieve the current cart

        // Check if the cart is empty
        if (cart.items.length === 0) {
            throw new NotFoundException('Cart is empty. Cannot confirm an empty order.'); // Handle empty cart case
        }

        // Create a new order based on the current cart
        const newOrder = this.orderRepository.create({
            // Since we removed price, totalAmount could be set to a default value or left out
            items: cart.items, // Assign cart items to the order
            createdAt: new Date(), // Set the current timestamp
        });

        // Save the new order to the database
        await this.orderRepository.save(newOrder);
        console.log('Order confirmed and saved:', newOrder); // Log the confirmed order

        // Clear the cart after confirmation
        await this.cartRepository.remove(cart); // This will remove the existing cart
        await this.cartRepository.save(new Cart()); // Save a new empty cart
    }
} 

//CLEAR YOUR JOTTINGS BELOW



// @Injectable()
// export class CartService {
//   private currentCart: Cart | undefined; // Holds the current cart in memory (simplification)

//   constructor(
//     @InjectRepository(Cart)
//     private cartRepository: Repository<Cart>,
//   ) {}

//   // Implement logic to retrieve a cart from storage or create a new one if it doesn't exist
//   async getCart(): Promise<Cart | undefined> {
//     if (!this.currentCart) {
//       const savedCart = await this.cartRepository.findOne({ relations: ['items'] });
//       this.currentCart = savedCart;
//     }
//     return this.currentCart;
//   }

//   async addItemToCart(item: CartItem): Promise<void> {
//     const cart = await this.getCart();
//     if (!cart) {
//       throw new Error('Cart not found');
//     }

//     // Check if item already exists in cart
//     const existingItem = cart.items.find((cartItem) => cartItem.name === item.name);
//     if (existingItem) {
//       existingItem.quantity += item.quantity; // Update quantity
//     } else {
//       cart.items.push(item); // Add new item
//     }

//     await this.saveCart(cart); // Save the updated cart to the database
//   }

//   async saveCart(cart: Cart): Promise<void> {
//     await this.cartRepository.save(cart);
//     this.currentCart = cart; // Update in-memory cart
//   }

//   async confirmOrder(): Promise<void> {
//     const cart = await this.getCart();
//     if (!cart || cart.items.length === 0) {
//       throw new Error('Cart is empty. Cannot confirm an empty order.');
//     }

//     // Simplified confirmation logic (replace with your actual confirmation process)
//     console.log('Order confirmed:', cart);
//     // Clear the cart (optional)
//     this.currentCart = undefined; // Reset the in-memory cart
//     await this.saveCart(new Cart()); // Save an empty cart to clear existing items
//   }
// }
// @Injectable()
// export class CartService {
//   constructor(
//     @InjectRepository(ConfirmOrderRepository)
//     private orderRepository: ConfirmOrderRepository,

//     @InjectRepository(CartRepository)
//     private cartRepository: CartRepository,

//     @InjectRepository(CartItemRepository)
//     private cartItemRepository: CartItemRepository,
//   ) {}

//   async confirmOrder(cart: Cart): Promise<ConfirmOrder> {
//     // Retrieve the cart with its associated items
//     const cartWithItems = await this.cartRepository.findCartWithItems(cart.id);

//     if (!cartWithItems) {
//       // Handle error if cart not found
//       throw new Error('Cart not found');
//     }

//     // Create a new confirm order entity
//     const confirmOrder = new ConfirmOrder();
//     confirmOrder.cart = cartWithItems; // Use the fetched cart with items

//     // Save the order and associated cart and cart items (using cartWithItems)
//     await this.orderRepository.save(confirmOrder);
//     // No need to save cart or cartItems separately as they're saved via the relationship

//     // Clear the cart items (optional)
//     cartWithItems.items = [];

//     return confirmOrder;
//   }
// }