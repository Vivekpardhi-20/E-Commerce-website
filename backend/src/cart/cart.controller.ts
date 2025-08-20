import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AddCartDto {
  productId: number;
  quantity: number;
}

interface UpdateCartDto {
  quantity: number;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

@Post('add')
async addToCart(@Req() req: any, @Body() body: AddCartDto) {
  return this.cartService.addToCart(req.user.id, body.productId, body.quantity);
}

@Get()
async getCart(@Req() req: any) {
  return this.cartService.getCart(req.user.id);
}



  // Update quantity of a cart item
  @Patch('update/:id')
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(id, body.quantity); 
  }

  // Remove an item from cart
  @Delete('remove/:id')
  async removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeFromCart(id); 
  }
}
