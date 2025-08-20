import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@Req() req, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(req.user, dto);
  }

  @Get()
  async getOrders(@Req() req) {
    return this.ordersService.getOrders(req.user.userId);
  }
}
