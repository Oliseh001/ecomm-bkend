import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './cart-item.entity'; // Import CartItem after defining Cart

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true }) // Enable cascade operations
  items: CartItem[];

  // Other properties and relationships can be defined here
}