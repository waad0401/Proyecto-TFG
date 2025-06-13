import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order }      from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(payload: { items: any[]; total: number }): Observable<any> {
    return this.http.post(this.url, payload);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/mine`);
  }
}
