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

  createOrder(data: CheckoutData): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel/${orderId}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }
}
