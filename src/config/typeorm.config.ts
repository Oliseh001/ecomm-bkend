import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from '../cart/cart.entity'; // Adjust the path
import { CartItem } from '../cart/cart-item.entity'

 export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cart-db',
    entities: [Cart,CartItem],  // any file or folder within src folder ending with .entity.ts
    synchronize: true, // check why false is recommended 
    logging: true,
    };

