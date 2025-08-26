import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Get all cart items for a user
async getCart(userId: number) {
  return this.cartRepo.find({
    where: { user: { id: userId } },
    relations: ['product'],
  });
}


  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

    if (quantity < 1) {
      throw new NotFoundException('You must add at least 1 item.');
    }
    if (product.stock < quantity) {
      throw new NotFoundException('Not enough stock');
    }

    let cartItem = await this.cartRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new NotFoundException(`Only ${product.stock} items available in stock.`);
      }
      cartItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        throw new NotFoundException(`Only ${product.stock} items available in stock.`);
      }
      cartItem = this.cartRepo.create({ user, product, quantity });
    }

    product.stock -= quantity;
    await this.productRepo.save(product);

    return this.cartRepo.save(cartItem);
  }


  async updateCartItem(cartId: number, quantity: number) {
    const cartItem = await this.cartRepo.findOne({ where: { id: cartId }, relations: ['product'] });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (quantity < 1) {
      throw new NotFoundException('You must add at least 1 item.');
    }
    const product = await this.productRepo.findOneBy({ id: cartItem.product.id });
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.stock) {
      throw new NotFoundException(`Only ${product.stock} items available in stock.`);
    }
    cartItem.quantity = quantity;
    return this.cartRepo.save(cartItem);
  }

 
  async removeFromCart(cartId: number) {
    const cartItem = await this.cartRepo.findOneBy({ id: cartId });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    return this.cartRepo.remove(cartItem);
  }
}
