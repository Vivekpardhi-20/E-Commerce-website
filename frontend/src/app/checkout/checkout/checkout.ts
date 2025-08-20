
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../cart/cart';
import { AuthService } from '../../auth/auth';
import { OrderService } from '../../orders/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  getImageUrl(path: string): string {
    if (!path) return 'assets/default-product.png';
    return `http://localhost:3000${path}`;
  }
  cart: any;
  addressLine1 = '';
  addressLine2 = '';
  city = '';
  state = '';
  postalCode = '';
  paymentMethod: 'COD' | 'CARD' = 'COD';
  loading = true;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) {
      alert('User not logged in');
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart();
  }


  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items: any[]) => {
        this.cart = {
          items,
          total: items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Cart load error:', err);
        this.loading = false;
        if (err.status === 401) {
          alert('Session expired. Please login again.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }


  increaseQuantity(item: any) {
    item.quantity++;
    this.cartService.updateCart(item.product.id, item.quantity).subscribe(() => this.loadCart());
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(item.product.id, item.quantity).subscribe(() => this.loadCart());
    }
  }

  removeItem(item: any) {
    this.cartService.removeItem(item.product.id).subscribe(() => this.loadCart());
  }

  placeOrder() {
    const orderData = {
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      city: this.city,
      state: this.state,
      postalCode: this.postalCode,
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Place order error:', err);
        alert('Failed to place order.');
      }
    });
  }
}
