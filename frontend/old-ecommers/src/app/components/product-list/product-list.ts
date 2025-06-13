import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMsg = '';

  // Base URL de imágenes (desde environment)
  private readonly imageBase = environment.imageBaseUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().pipe(
      // Asegura que 'loading' se desactive tanto en éxito como en error
      finalize(() => this.loading = false)
    ).subscribe({
      next: data => {
        this.products = data;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los productos';
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  // Crear la ruta de donde estaran las imagenes
  imageSrc(p: Product): string {
    return `${this.imageBase}/${p.image}`;
  }
}
