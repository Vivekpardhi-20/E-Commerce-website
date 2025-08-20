import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../product';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../cart/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  get maxQuantity() {
    return this.product ? Math.min(5, this.product.stock) : 1;
  }
  product!: Product;
  loading = true;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (err) => console.error(err)
      });
  }

  addToCart(product: Product) {
    const maxAllowed = Math.min(5, product.stock);
    if (this.quantity < 1 || this.quantity > maxAllowed) {
      alert(`You can only buy between 1 and ${maxAllowed} quantities for this product.`);
      return;
    }
    this.cartService.addToCart(product.id, this.quantity).subscribe({
      next: () => alert(`${product.name} added to cart!`),
      error: (err) => {
        alert(err?.error?.message || 'Failed to add to cart!');
      }
    });
  }
}
