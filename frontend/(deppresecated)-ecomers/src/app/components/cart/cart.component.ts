import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cart: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cart.items$.subscribe(i => {
      this.items = i;
      this.total = i.reduce((sum, x) => sum + x.product.price * x.quantity, 0);
    });
  }

  updateQty(item: CartItem, evt: any) {
    const q = +evt.target.value;
    if (q <= 0) this.cart.removeItem(item.product.id);
    else this.cart.updateQuantity(item.product.id, q);
  }

  clear() { this.cart.clearCart(); }
  remove(id: string) { this.cart.removeItem(id); }
  checkout() { this.router.navigate(['/checkout']); }
}
