// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { OrderHistoryComponent } from './components/order-history/order-history';

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
    BrowserModule,         // incluye CommonModule
    FormsModule,           // para ngModel
    ReactiveFormsModule,   // para formGroup
    HttpClientModule,      // para HttpClient
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
