import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(items: CartItem[]) {
    return this.http.post<Order>(this.base, { items });
  }

  getUserOrders() {
    return this.http.get<Order[]>(`${this.base}/my`);
  }
}
