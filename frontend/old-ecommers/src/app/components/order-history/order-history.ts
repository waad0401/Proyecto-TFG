import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-order-history',
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
})

export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  errorMsg = '';
  imageBase = environment.imageBaseUrl;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data: Order[]) => {
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
