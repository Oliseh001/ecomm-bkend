import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Cart } from '../cart/entities/cart.entity'; // Ensure this is the correct path
import { Order } from '../cart/entities/order.entity'; // Ensure this is the correct path

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(() => Cart, cart => cart.user) // One-to-Many relationship with Cart
    carts: Cart[];

    @OneToMany(() => Order, order => order.user) // One-to-Many relationship with Order
    orders: Order[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
