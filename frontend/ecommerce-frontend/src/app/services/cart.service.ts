import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem { product: Product; quantity: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('E_COMM_CART');
    if (stored) this.itemsSubject.next(JSON.parse(stored));
  }

  private update(items: CartItem[]) {
    this.itemsSubject.next(items);
    localStorage.setItem('E_COMM_CART', JSON.stringify(items));
  }

  addItem(product: Product, qty = 1) {
    const items = [...this.itemsSubject.value];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) items[idx].quantity += qty;
    else items.push({ product, quantity: qty });
    this.update(items);
  }

  updateQuantity(id: string, qty: number) {
    const items = this.itemsSubject.value.map(i =>
      i.product.id === id ? { ...i, quantity: qty } : i
    );
    this.update(items);
  }

  removeItem(id: string) {
    this.update(this.itemsSubject.value.filter(i => i.product.id !== id));
  }

  clearCart() { this.update([]); }
}
