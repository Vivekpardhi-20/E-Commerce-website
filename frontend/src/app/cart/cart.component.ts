import { Component, OnInit } from '@angular/core';
import { CartService } from './cart';
import { AuthService } from '../auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = true;
  total = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkLoginAndLoadCart();
  }

  checkLoginAndLoadCart() {
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
        this.cartItems = Array.isArray(items) ? items : [];
        this.total = this.cartItems.reduce(
          (sum: number, item: any) => sum + item.product.price * item.quantity,
          0
        );
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        if (err.error && err.error.feildErrors) {
          console.error('Field Errors:', err.error.feildErrors);
        }
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
    this.updateCart(item); 
  }

  decreaseQuantity(item: any) { 
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(item); 
    }
  }

  removeItem(item: any) {
    this.cartService.removeItem(item.id).subscribe(() => this.loadCart());
  }

  updateCart(item: any) {
    this.cartService.updateCart(item.id, item.quantity).subscribe(() => this.loadCart());
  }

  proceedToCheckout() { 
    this.router.navigate(['/checkout']); 
  }

getImageUrl(path: string) {
  if (!path) return 'assets/default-product.png';
  return `http://localhost:3000${path}`;
}

}
