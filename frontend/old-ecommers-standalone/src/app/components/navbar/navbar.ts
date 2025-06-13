import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService }  from '../../services/auth.service';
import { CartService }  from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  isLogged = this.auth.isLoggedIn();
  cartCount = 0;

  constructor(private auth: AuthService, private cart: CartService) {
    this.cart.items$.subscribe(it => this.cartCount = it.reduce((s,x)=>s+x.quantity,0));
  }

  logout() { this.auth.logout(); }
}
