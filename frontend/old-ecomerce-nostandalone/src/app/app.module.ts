// src/app/app.module.ts
import { NgModule }                   from '@angular/core';
import { BrowserModule }              from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { AppRoutingModule }           from './app-routing.module';

// Componentes “no-standalone”
import { AppComponent }               from './app.component';
import { NavbarComponent }            from './components/navbar/navbar';
import { ProductListComponent }       from './components/product-list/product-list';
import { ProductDetailComponent }     from './components/product-detail/product-detail';
import { CartComponent }              from './components/cart/cart';
import { CheckoutComponent }          from './components/checkout/checkout';
import { LoginComponent }             from './components/login/login';
import { RegisterComponent }          from './components/register/register';
import { OrderHistoryComponent }      from './components/order-history/order-history';

// Interceptor JWT (token.interceptor.ts)
import { TokenInterceptor }           from './interceptors/token.interceptor';

// Servicio de configuración si lo usas
import { ConfigService }              from './core/services/config.service';
import { APP_INITIALIZER }            from '@angular/core';

// Factory para cargar configuración antes del bootstrap (opcional)
export function initApp(config: ConfigService): () => Promise<void> {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,         // incluye CommonModule (ngIf, ngFor, pipes…)
    HttpClientModule,      // HttpClient para llamadas a la API
    FormsModule,           // para ngModel en formularios template-driven
    ReactiveFormsModule,   // para FormGroup/ReactiveForms
    AppRoutingModule       // tus rutas definidas en app-routing.module.ts
  ],
  providers: [
    // Si usas ConfigService para cargar config previa
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [ConfigService],
      multi: true
    },
    // Interceptor JWT
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
