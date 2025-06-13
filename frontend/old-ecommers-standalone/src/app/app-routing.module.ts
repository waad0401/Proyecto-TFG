// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ProductListComponent }   from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent }          from './components/cart/cart';
import { CheckoutComponent }      from './components/checkout/checkout';
import { LoginComponent }         from './components/login/login';
import { RegisterComponent }      from './components/register/register';
import { OrderHistoryComponent }  from './components/order-history/order-history';
import { AuthGuard }              from './guards/auth.guard';

export const routes: Routes = [
  { path: '',         component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart',     component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders',   component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

export const AppRoutingModule = provideRouter(routes);
