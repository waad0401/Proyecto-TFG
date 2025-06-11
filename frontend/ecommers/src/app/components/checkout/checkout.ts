import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  loading = false;
  errorMsg = '';
  successMsg = '';
  imageBase = environment.imageBaseUrl;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
      this.total = this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  }

  placeOrder(): void {
    if (!this.items.length) return;
    this.loading = true;
    this.orderService.placeOrder(this.items).subscribe({
      next: () => {
        this.successMsg = 'Pedido realizado con éxito';
        this.cartService.clearCart();
        setTimeout(() => this.router.navigate(['/orders']), 2000);
      },
      error: () => {
        this.errorMsg = 'Error al procesar el pedido';
        this.loading = false;
      }
    });
  }

  imageSrc(p: CartItem): string {
    return `${this.imageBase}/${p.product.image}`;
  }
}
