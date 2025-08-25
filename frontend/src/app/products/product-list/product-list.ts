import { Component, OnInit } from '@angular/core';
import { ProductService,Product } from '../product';
import { CartService } from '../../cart/cart';
import { AuthService } from '../../auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  get totalPages() {
    return Math.ceil(this.products.length / this.pageSize);
  }
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.loading = false;
        this.currentPage = 1;
      },
      error: (err: any) => console.error('Error loading products', err)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  addToCart(productId: number, quantity: number = 1) {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login first!');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (err: any) => console.error('Add to cart error', err)
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }
}
