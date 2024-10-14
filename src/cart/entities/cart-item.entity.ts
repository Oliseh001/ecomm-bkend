import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity() // Decorator that marks this class as a database entity
export class CartItem {
    @PrimaryGeneratedColumn() // Automatically generated unique identifier for the cart item
    id: number;

    @Column() // Column for the name of the item
    name: string;

    @Column() // Column for the quantity of the item in the cart
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items) // Relationship back to the Cart
    cart: Cart; // Reference to the parent Cart
}
