import { Component, OnInit } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule }        from '@angular/router';
import { ProductService }      from '../../services/product.service';
import { CartService }         from '../../services/cart.service';
import { Product }             from '../../models/product';

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  imports: [ CommonModule, RouterModule ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];    // <-- tipo explícito
  loading = true;
  error = '';

  constructor(
    private ps: ProductService,
    private cs: CartService
  ) {}

  ngOnInit(): void {
    this.ps.getAll().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading products';
        this.loading = false;
      }
    });
  }

  add(p: Product): void {
    this.cs.addItem(p);
  }
}
