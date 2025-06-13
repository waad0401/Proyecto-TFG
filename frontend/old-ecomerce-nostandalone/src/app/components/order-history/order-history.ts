import { Component, OnInit } from '@angular/core';
import { OrderService }      from '../../services/order.service';
import { Order }             from '../../models/order';

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
      error: ()   => { this.errorMsg = 'Error al cargar pedidos'; this.loading = false; }
    });
  }
}
