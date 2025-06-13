import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';       

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
 ]
})

export class NavbarComponent implements OnInit {
  isLogged   = false;
  cartCount  = 0;
  imageBase  = environment.imageBaseUrl;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$().subscribe(logged => this.isLogged = logged);
    this.cart.items$.subscribe(items =>
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
    );
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
