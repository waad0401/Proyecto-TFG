import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',   redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductListComponent) },
  { path: 'product/:id', loadComponent: () => import('./components/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: 'cart',       loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent) },
  { path: 'checkout',   loadComponent: () => import('./components/checkout/checkout').then(m => m.CheckoutComponent) },
  { path: 'login',      loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'register',   loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
  { path: 'order-history', loadComponent: () => import('./components/order-history/order-history').then(m => m.OrderHistoryComponent) },
  { path: '**', redirectTo: 'products' }
];
