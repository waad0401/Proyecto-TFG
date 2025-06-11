import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  errorMsg = '';
  quantity = 1;
  imageBase = environment.imageBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.errorMsg = 'Producto no encontrado'; this.loading = false; }
    });
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addItem(this.product, this.quantity);
    }
  }

  imageSrc(): string {
    return this.product ? `${this.imageBase}/${this.product.image}` : '';
  }
}
