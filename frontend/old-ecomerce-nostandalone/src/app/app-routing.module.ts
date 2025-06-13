import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent }        from './components/cart/cart';
import { CheckoutComponent }    from './components/checkout/checkout';
import { LoginComponent }       from './components/login/login';
import { RegisterComponent }    from './components/register/register';
import { OrderHistoryComponent } from './components/order-history/order-history';
import { AuthGuard }            from './guards/auth.guard';

const routes: Routes = [
  { path: '',   redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'products' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
