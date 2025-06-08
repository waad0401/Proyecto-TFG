import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Obtiene todos los productos
  getAll() {
    return this.http.get<Product[]>(this.base);
  }

  // Obtiene un producto por ID
  getById(id: string) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}
