import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User])],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
