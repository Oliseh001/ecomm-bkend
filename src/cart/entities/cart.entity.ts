import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];
}