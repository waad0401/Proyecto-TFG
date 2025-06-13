import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent }      from './app/app.component';
import { provideRouter }     from '@angular/router';
import { routes }            from './app/app-routing.module';
import { HttpClientModule }  from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(provideRouter(routes)),
    provideAnimations()
  ]
}).catch(err => console.error(err));
