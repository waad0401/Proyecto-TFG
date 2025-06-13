// src/main.ts

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }                from '@angular/platform-browser';
import { provideRouter }                      from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent }      from './app/app.component';
import { routes }            from './app/app.routes';
import { TokenInterceptor }  from './app/interceptors/token.interceptor';
import { environment }       from './environments/environment';

// Si estamos en build de producción (reemplazado por environment.prod.ts):
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
.catch(err => console.error(err));
