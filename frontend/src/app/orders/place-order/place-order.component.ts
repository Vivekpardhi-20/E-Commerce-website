import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../order';
import { CartService } from '../../cart/cart';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  cart: any;
  addressLine1 = '';
  addressLine2 = '';
  city = '';
  state = '';
  postalCode = '';
  paymentMethod: 'COD' | 'CARD' = 'COD';
  loading = true;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) {
      alert('User not logged in');
      this.router.navigate(['/login']);
      return;
    }
    this.loadCart(); 
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = {
          items: res.data,
          total: res.data.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)
        };
        this.loading = false;
        if (res.feildErrors && res.feildErrors.length) {
          // Optionally show field errors in UI
          console.error('Field Errors:', res.feildErrors);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.feildErrors) {
          // Optionally show field errors in UI
          console.error('Field Errors:', err.error.feildErrors);
        }
        if (err.status === 401) {
          alert('Session expired. Please login again.');
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
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
      next: (res: any) => {
        if (res.error) {
          if (res.feildErrors && res.feildErrors.length) {
            // Optionally show field errors in UI
            alert('Order error: ' + res.feildErrors.join(', '));
          } else {
            alert('Order error: ' + res.message);
          }
        } else {
          alert('Order placed successfully!');
          this.router.navigate(['/orders']);
        }
      },
      error: (err) => {
        if (err.error && err.error.feildErrors) {
          alert('Order error: ' + err.error.feildErrors.join(', '));
        } else {
          alert('Failed to place order.');
        }
        console.error('Place order error:', err);
      }
    });
  }
}
