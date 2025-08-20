import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/products`).pipe(
      map(res =>
        (res.data || []).map((p: Product) => ({
          ...p,
          imageUrl: `${this.baseUrl}${p.imageUrl}`
        }))
      )
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`).pipe(
      map(res => {
        const p = res.data || res;
        return { ...p, imageUrl: `${this.baseUrl}${p.imageUrl}` };
      })
    );
  }
}
