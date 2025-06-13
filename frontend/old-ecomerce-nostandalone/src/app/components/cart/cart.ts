import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  imageBase = environment.imageBase;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }

  updateQty(item: CartItem, qty: number): void {
    if (qty > 0) {
      this.cartService.updateQuantity(item.product.id, qty);
    } else {
      this.cartService.removeItem(item.product.id);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
