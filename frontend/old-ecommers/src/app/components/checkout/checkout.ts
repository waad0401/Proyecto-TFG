import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
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
    this.orderService.placeOrder({
      items: this.items,
      total: this.total
    }).subscribe({
      next: () => this.successMsg = 'Pedido realizado con éxito',
      error: () => this.errorMsg = 'Error al procesar el pedido'
    });
  }

  imageSrc(p: CartItem): string {
    return `${this.imageBase}/${p.product.image}`;
  }
}
