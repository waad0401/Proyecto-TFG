import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { environment } from '../environments/environment';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}

  placeOrder(items: CartItem[]): Observable<Order> {
    return this.http.post<Order>(this.api, { items });
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/my`);
  }
}
