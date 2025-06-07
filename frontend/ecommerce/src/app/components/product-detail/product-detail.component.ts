import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product|null = null;
  qty = 1;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ps.getById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.error = 'No se cargó el producto'; this.loading = false; }
    });
  }

  addToCart() {
    if (this.product) this.cart.addItem(this.product, this.qty);
  }
}
