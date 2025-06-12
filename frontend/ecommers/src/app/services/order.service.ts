import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo pedido. Envía items y total.
   */
  create(order: { items: any[]; total: number }) {
    return this.http.post(this.api, order);
  }

  /**
   * Obtiene el historial de pedidos.
   */
  list() {
    return this.http.get(this.api);
  }
}
