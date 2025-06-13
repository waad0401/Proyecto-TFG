import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  /**
   * Añade un producto al carrito o suma cantidad si ya existe.
   */
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

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * Usa string para productId, igual que Product.id.
   */
  updateQuantity(productId: string, quantity: number): void {
    const items = this.itemsSubject.value.map(i =>
      i.product.id === productId
        ? { ...i, quantity }
        : i
    );
    this.itemsSubject.next(items);
  }

  /**
   * Elimina un producto del carrito por su ID (string).
   */
  removeItem(productId: string): void {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
  }

  /**
   * Vacía completamente el carrito.
   */
  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
