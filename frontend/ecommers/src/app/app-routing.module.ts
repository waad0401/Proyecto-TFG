import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa aquí tus componentes
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Ruta raíz → lista de productos
    { path: '', /* component: ProductListComponent */ },
  // Login y registro accesibles a todos
    { path: 'login', /* component: LoginComponent */ },
    { path: 'register', /* component: RegisterComponent */ },
  // Rutas protegidas:
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },

  // Ruta comodín para no encontrados
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
