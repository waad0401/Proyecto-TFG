import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { ActivatedRoute }         from '@angular/router';
import { ProductService }         from '../../services/product.service';
import { CartService }            from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  imports: [CommonModule]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  error = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cs: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ps.getById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.error = 'No se encontró el producto'; this.loading = false; }
    });
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cs.addItem(this.product, this.quantity);
    }
  }
}
