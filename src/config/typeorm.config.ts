import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Order } from 'src/cart/entities/order.entity';
import { User } from 'src/auth/user.entity';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT, 10),
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    entities: [Cart, CartItem, Order, User],
    synchronize: process.env.TYPEORM_SYNC === 'false',
    logging: false,
    ssl: {
        rejectUnauthorized: true, // This is important for self-signed certificates. Set to true for production.
    },
};

