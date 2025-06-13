import { Component }    from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule }  from '@angular/router';
import { AuthService }   from '../../services/auth.service';
import { CartService }   from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [ CommonModule, RouterModule ]
})
export class NavbarComponent {
  cartCount = 0;

  constructor(
    private auth: AuthService,
    private cart: CartService
  ) {
    this.cart.items$.subscribe(items =>
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
    );
  }

  /** Evaluado cada vez que Angular renderiza */
  get isLogged(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
  }
}
