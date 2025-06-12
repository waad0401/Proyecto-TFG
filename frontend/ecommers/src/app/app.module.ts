// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// Componentes “no-standalone”
import { AppComponent }          from './app.component';
import { NavbarComponent }       from './components/navbar/navbar';
import { ProductListComponent }  from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent }         from './components/cart/cart';
import { CheckoutComponent }     from './components/checkout/checkout';
import { LoginComponent }        from './components/login/login';
import { RegisterComponent }     from './components/register/register';
import { OrderHistoryComponent } from './components/order-history/order-history';

// Interceptor de ejemplo
import { TokenInterceptor }      from './interceptors/token.interceptor';

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
    BrowserModule,         // trae CommonModule
    FormsModule,           // ngModel
    ReactiveFormsModule,   // formGroup
    HttpClientModule,      // HttpClient
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
