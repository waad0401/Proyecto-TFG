import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMsg = '';
  imageBase = environment.imageBaseUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los productos';
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  // Método para componer la URL de la imagen
  imageSrc(p: Product): string {
    return `${this.imageBase}/${p.image}`;
  }
}
