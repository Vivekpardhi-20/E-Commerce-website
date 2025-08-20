import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data;
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
        console.error('Failed to fetch orders:', err);
      }
    });
  }
}
