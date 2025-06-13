import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isLogged   = false;
  cartCount  = 0;
  imageBase  = environment.imageBase;

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
