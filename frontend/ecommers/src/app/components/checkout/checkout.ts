import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { CartService }       from '../../services/cart.service';
import { OrderService }      from '../../services/order.service';
import { RouterLink }        from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  imports: [CommonModule, RouterLink]
})
export class CheckoutComponent implements OnInit {
  items: any[] = [];
  total = 0;
  success = '';
  error = '';

  constructor(
    private cs: CartService,
    private os: OrderService
  ) {}

  ngOnInit(): void {
    this.cs.items$.subscribe(it => {
      this.items = it;
      this.total = it.reduce((s, i) => s + i.product.price * i.quantity, 0);
    });
  }

  placeOrder() {
    this.os.placeOrder(this.items).subscribe({
      next: o => { this.success = 'Pedido realizado!'; this.cs.clearCart(); },
      error: () => { this.error = 'Error al procesar el pedido'; }
    });
  }
}
