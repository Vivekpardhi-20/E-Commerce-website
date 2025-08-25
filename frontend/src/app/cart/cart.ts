import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private auth: AuthService) {}

  addToCart(productId: number, quantity: number) {
    const token = this.auth.getToken();
    return this.http.post(
      `${this.apiUrl}/add`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  getCart(): Observable<any[]> {
    const token = this.auth.getToken();
    return this.http.get<any>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(
      map(res => res.data || [])
    );
  }

  removeItem(id: number): Observable<any> {
    const token = this.auth.getToken();
    return this.http.delete<any>(`${this.apiUrl}/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateCart(id: number, quantity: number): Observable<any> {
    const token = this.auth.getToken();
    return this.http.patch<any>(
      `${this.apiUrl}/update/${id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
