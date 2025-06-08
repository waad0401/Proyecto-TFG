// src/app/components/order-history/order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  errorMsg = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: data => { this.orders = data; this.loading = false; },
      error: () => { this.errorMsg = 'No se pudo cargar el historial'; this.loading = false; }
    });
  }
}
