import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Envía un nuevo pedido al backend.
   * @param order Objeto con items y total
   * @returns Observable de la respuesta del servidor
   */
  placeOrder(order: { items: any[]; total: number }): Observable<any> {
    return this.http.post(this.api, order);
  }

  /**
   * Obtiene el listado de pedidos del usuario.
   * @returns Observable de array de pedidos
   */
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.api);
  }
}