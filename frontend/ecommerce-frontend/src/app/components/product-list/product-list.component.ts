import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: data => { this.products = data; this.loading = false; },
      error: () => { this.error = 'Error cargando productos'; this.loading = false; }
    });
  }

  addToCart(prod: Product) {
    this.cartService.addItem(prod);
  }
}
