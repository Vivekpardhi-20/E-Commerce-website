import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
