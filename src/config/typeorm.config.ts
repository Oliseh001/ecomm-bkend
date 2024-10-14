import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity'; // Adjust the path
import { CartItem } from '../cart/entities/cart-item.entity'
import { Order } from 'src/cart/entities/order.entity';

 export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cart-db',
    entities: [Cart, CartItem, Order],  // any file or folder within src folder ending with .entity.ts
    synchronize: true, // check why false is recommended 
    logging: true,
    };

