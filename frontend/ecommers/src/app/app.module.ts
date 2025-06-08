import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';  // Módulo de rutas
import { AppComponent } from './app.component';

// Interceptor que inyecta el JWT en cada petición
import { TokenInterceptor } from './interceptors/token.interceptor';
// Guard que protege rutas
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    // <-- Aquí irán tus componentes:
    // NavbarComponent,
    // ProductListComponent,
    // LoginComponent, etc.
  ],
  imports: [
    BrowserModule,
    HttpClientModule,     // Para consumir la API
    AppRoutingModule     // Para navegación entre vistas
  ],
  providers: [
    // Registramos el interceptor de token
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    // Registramos el AuthGuard (si lo usas)
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
