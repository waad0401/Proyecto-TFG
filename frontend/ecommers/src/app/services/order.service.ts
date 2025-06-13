import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { CartItem } from '../models/cart-item';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(items: CartItem[]) {
    // backend espera { items: [...], total: number }
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    return this.http.post<Order>(`${environment.apiUrl}/orders`, { items, total });
  }

  getUserOrders() {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }
}
