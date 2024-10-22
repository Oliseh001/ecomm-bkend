import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json') // Ensure this is a JSON column for storing an array of items
    items: { name: string; quantity: number }[];

    @Column()
    createdAt: Date;
}
