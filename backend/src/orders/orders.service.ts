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

  async checkout(user: any, dto: CheckoutDto) {
    return this.dataSource.transaction(async (manager) => {
  
  // Always use user.userId from JWT payload
  const dbUser = await manager.findOne(User, { where: { id: user.userId } });
  if (!dbUser) throw new BadRequestException('User not found');

  // Find all cart items for the user
  const cartItems = await manager.find(Cart, {
    where: { user: { id: dbUser.id } },
    relations: ['product'],
  });
  // Logging removed
  if (!cartItems.length) {
    throw new BadRequestException('Cart is empty');
  }
  // ...existing code...


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
  // Logging removed

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
  // Logging removed

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

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user: { id: userId } } });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (order.status !== 'placed') {
      throw new BadRequestException('Only placed orders can be cancelled');
    }
    order.status = 'cancelled';
    await this.orderRepo.save(order);
    return order;
  }
}
