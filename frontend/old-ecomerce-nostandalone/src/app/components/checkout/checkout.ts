import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
    });
  }

  placeOrder(): void {
    if (!this.items.length) return;
    this.loading = true;
    this.orderService.placeOrder({ items: this.items, total: this.total })
      .subscribe({
        next: () => {
          this.successMsg = 'Pedido realizado con éxito';
          this.cartService.clearCart();
          this.loading = false;
          setTimeout(() => this.router.navigate(['/order-history']), 2000);
        },
        error: () => {
          this.errorMsg = 'Error al procesar el pedido';
          this.loading = false;
        }
      });
  }
}
