import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem }      from '../models/cart-item';
import { Product }       from '../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  addItem(product: Product, quantity: number = 1): void {
    const items = [...this.itemsSubject.value];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx > -1) {
      items[idx].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.itemsSubject.next(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.itemsSubject.value.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    this.itemsSubject.next(items);
  }

  removeItem(productId: string): void {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
