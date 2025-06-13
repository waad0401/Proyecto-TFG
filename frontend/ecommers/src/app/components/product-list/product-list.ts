import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterLink }         from '@angular/router';
import { ProductService }     from '../../services/product.service';
import { CartService }        from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  imports: [CommonModule, RouterLink]
})
export class ProductListComponent implements OnInit {
  products = [];
  loading = true;
  error = '';

  constructor(private ps: ProductService, private cs: CartService) {}

  ngOnInit() {
    this.ps.getAll().subscribe({
      next: data => { this.products = data; this.loading = false; },
      error: () => { this.error = 'Error loading products'; this.loading = false; }
    });
  }

  add(p: any) { this.cs.addItem(p); }
}
