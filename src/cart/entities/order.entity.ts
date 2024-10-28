// order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json') // Ensure this is a JSON column for storing an array of items
    items: { name: string; quantity: number }[];

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.orders) // Relationship to User
    user: User; // Reference to the user who placed the order

    @ManyToOne(() => User) // Relationship to User who confirmed the order
    confirmedBy: User; // Reference to the user who confirmed the order
}
