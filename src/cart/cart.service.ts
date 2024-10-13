import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  // Retrieve a cart by ID or create a new one if none exists
  async getCart(id: number): Promise<Cart | { message: string }> {
    let cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items'], // Load cart items
    });

    // Create a new cart if it does not exist
    if (!cart) {
      cart = new Cart();
      await this.cartRepository.save(cart);
      return cart; // Return newly created cart
    }

    return cart; // Return existing cart
  }

  // Get all carts
  async getAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['items'] }); // Fetch all carts with their items
  }

  // Add an item to the cart
  async addItemToCart(item: CartItem): Promise<void> {
    const cartResponse = await this.getCart(item.cart.id); // Get the cart to add item to

    // Check if the cart exists
    if (!cartResponse) {
      throw new NotFoundException('Cart not found');
    }

    const cart = cartResponse as Cart;

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity; // Update quantity
      await this.cartItemRepository.save(existingItem); // Save updated item
    } else {
      // Add new item to the cart
      const newItem = this.cartItemRepository.create(item);
      newItem.cart = cart; // Associate the item with the cart
      cart.items.push(newItem);
      await this.cartItemRepository.save(newItem); // Save new item
    }

    await this.cartRepository.save(cart); // Save the updated cart
  }

  // Remove an item from the cart by item ID
  async removeItemFromCart(itemId: number): Promise<void> {
    const itemToRemove = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: ['cart'],
    });

    if (!itemToRemove) {
      throw new NotFoundException('Item not found in cart');
    }

    // Remove the item from the cart
    const cart = itemToRemove.cart;
    cart.items = cart.items.filter(item => item.id !== itemId);

    await this.cartItemRepository.remove(itemToRemove); // Remove item from the database
    await this.cartRepository.save(cart); // Save the updated cart
  }

  // Confirm the order (this is a placeholder for actual order confirmation logic)
  async confirmOrder(): Promise<void> {
    const cartResponse = await this.getAllCarts(); // Get all carts or specify which one

    // Check if the cart is empty or doesn't exist
    if (!cartResponse.length || (cartResponse[0].items.length === 0)) {
      throw new NotFoundException('Cart is empty. Cannot confirm an empty order.');
    }

    const cart = cartResponse[0]; // For simplicity, using the first cart

    // Placeholder for confirmation logic (e.g., saving to order database)
    console.log('Order confirmed:', cart);

    // Clear the cart (optional)
    await this.cartRepository.save(new Cart()); // Save an empty cart to clear existing items
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