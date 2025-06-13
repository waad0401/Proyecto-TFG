import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading   = true;
  errorMsg  = '';
  imageBase = environment.imageBase;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: data => { this.products = data; this.loading = false; },
      error: ()   => { this.errorMsg = 'Error al cargar productos'; this.loading = false; }
    });
  }

  addToCart(p: Product): void {
    this.cartService.addItem(p);
  }
}
