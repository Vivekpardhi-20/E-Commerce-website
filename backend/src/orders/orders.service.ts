// orders.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Cart } from '../cart/cart.entity';
import { User } from '../users/user.entity';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
  ) {}

  async checkout(user: User, dto: CheckoutDto) {
    return this.dataSource.transaction(async (manager) => {
  
      const dbUser = await manager.findOne(User, { where: { id: user.id } });
      if (!dbUser) throw new BadRequestException('User not found');

const cartItems = await manager.find(Cart, {
  where: { user: { id: dbUser.id } },
  relations: ['product'],
});
if (!cartItems.length) {
  throw new BadRequestException('Cart is empty');
}


      const order = manager.create(Order, {
        user: dbUser,
        status: 'placed',
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2 || '',
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        paymentMethod: dto.paymentMethod || 'COD',
        total: 0,
      });
      const savedOrder = await manager.save(order);

      let total = 0;
      const orderItems: OrderItem[] = cartItems.map(ci => {
        const lineTotal = Number(ci.product.price) * ci.quantity;
        total += lineTotal;
        return manager.create(OrderItem, {
          order: savedOrder,
          product: ci.product,
          quantity: ci.quantity,
          unitPrice: Number(ci.product.price),
          lineTotal,
        });
      });
      await manager.save(orderItems);

      savedOrder.total = total;
      await manager.save(savedOrder);

  
      await manager.remove(cartItems);

      return savedOrder;
    });
  }

  async getOrders(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
