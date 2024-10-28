import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity'; // Adjust the path
import { CartItem } from '../cart/entities/cart-item.entity'
import { Order } from 'src/cart/entities/order.entity';
import { User } from 'src/auth/user.entity';
import * as config from 'config'

const dbConfig = config.get('db');


 export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME ||dbConfig.password,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [Cart, CartItem, Order, User],  // any file or folder within src folder ending with .entity.ts
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
    logging: false,
    };

