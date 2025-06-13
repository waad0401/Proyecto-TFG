import { Component, OnInit }  from '@angular/core';
import { CommonModule }       from '@angular/common';
import { CartService }        from '../../services/cart.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [CommonModule, RouterLink]
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total = 0;

  constructor(
    private cs: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cs.items$.subscribe(it => {
      this.items = it;
      this.total = it.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }

  updateQty(item: any, qty: number) {
    if (qty > 0) {
      this.cs.updateQuantity(item.product.id, qty);
    } else {
      this.cs.removeItem(item.product.id);
    }
  }

  clear() {
    this.cs.clearCart();
  }

  goCheckout() {
    this.router.navigate(['/checkout']);
  }
}
