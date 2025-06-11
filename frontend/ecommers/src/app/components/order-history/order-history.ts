import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  errorMsg = '';
  imageBase = environment.imageBaseUrl;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar el historial';
        this.loading = false;
      }
    });
  }

  imageSrc(itemImage: string): string {
    return `${this.imageBase}/${itemImage}`;
  }
}
