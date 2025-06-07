import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> { return this.http.get<Product[]>(this.api); }
  getById(id: string): Observable<Product> { return this.http.get<Product>(`${this.api}/${id}`); }
}
