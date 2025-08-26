import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product';
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
  styleUrls: ['./product-list.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;
  showSpinnerOnPageChange: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts(false);
  }

  loadProducts(showSpinner: boolean = true): void {
    this.loading = showSpinner;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        // Show spinner for at least 1 second
        setTimeout(
          () => {
            this.products = res.data;
            this.totalPages = res.totalPages;
            this.totalItems = res.totalItems;
            this.loading = false;
          },
          showSpinner ? 1000 : 0
        );
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts(true);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts(true);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(true);
    }
  }

  addToCart(productId: number, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (err: any) => console.error('Add to cart error', err),
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }
}
