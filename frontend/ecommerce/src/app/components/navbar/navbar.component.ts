import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLogged = false;
  cartCount = 0;

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => this.isLogged = !!u);
    this.cartService.items$.subscribe(items =>
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
    );
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
