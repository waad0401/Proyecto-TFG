// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule }       from './app-routing.module';
import { AppComponent }           from './app.component';            // standalone
import { NavbarComponent }        from './components/navbar/navbar'; // standalone
import { ProductListComponent }   from './components/product-list/product-list'; 
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent }          from './components/cart/cart';
import { CheckoutComponent }      from './components/checkout/checkout';
import { LoginComponent }         from './components/login/login';
import { RegisterComponent }      from './components/register/register';
import { OrderHistoryComponent }  from './components/order-history/order-history';

@NgModule({
  // Como todos estos componentes son standalone, no van en `declarations`
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    // En lugar de declararlos, los importamos directamente:
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
  // El único "declaration" obligatorio para standalone apps es el bootstrap
  bootstrap: [AppComponent]
})
export class AppModule { }
