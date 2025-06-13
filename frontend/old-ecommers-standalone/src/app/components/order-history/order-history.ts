import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { OrderService }      from '../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-history',
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css'],
  imports: [CommonModule]
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private os: OrderService) {}

  ngOnInit(): void {
    this.os.getUserOrders().subscribe({
      next: data => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar pedidos'; this.loading = false; }
    });
  }
}
