import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity() // Decorator that marks this class as a database entity
export class Order {
    @PrimaryGeneratedColumn() // Automatically generated unique identifier for the order
    id: number;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true }) // Relationship with CartItem
    items: CartItem[]; // Array of items included in the order

    @Column() // Column for the creation date of the order
    createdAt: Date; // Timestamp for when the order was created
}
