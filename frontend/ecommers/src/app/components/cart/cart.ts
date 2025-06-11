import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  imageBase = environment.imageBaseUrl;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }

  updateQty(item: CartItem, newQty: number): void {
    if (newQty > 0) {
      this.cartService.updateQuantity(item.product.id, newQty);
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

  imageSrc(p: CartItem): string {
    return `${this.imageBase}/${p.product.image}`;
  }
}
