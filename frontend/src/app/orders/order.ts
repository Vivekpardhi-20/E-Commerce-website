import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth';
import { Observable } from 'rxjs';

export interface CheckoutData {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod?: 'COD' | 'CARD';
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Create a new order (checkout)
  createOrder(data: CheckoutData): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch orders for the logged-in user
  getOrders(): Observable<any> {
    // Just call /orders; backend gets userId from JWT
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }
}
