import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
})

export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  errorMsg = '';
  quantity = 1;

  // Base URL de imágenes (desde environment)
  private readonly imageBase = environment.imageBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).pipe(
      // Desactiva loading al completar (éxito o error)
      finalize(() => this.loading = false)
    ).subscribe({
      next: p => { this.product = p; },
      error: () => { this.errorMsg = 'Producto no encontrado'; }
    });
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addItem(this.product, this.quantity);
    }
  }

  /**
   * Devuelve la URL completa de la imagen del producto.
   */
  imageSrc(): string {
    return this.product
      ? `${this.imageBase}/${this.product.image}`
      : '';
  }
}
