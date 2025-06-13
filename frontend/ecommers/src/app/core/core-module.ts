// src/app/core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule }             from '@angular/common/http';

@NgModule({
  imports:      [ HttpClientModule ],
  exports:      [ HttpClientModule ],
  providers:    []   // Los servicios con providedIn:'root' no van aquí
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule ya está cargado. Importa CoreModule solo en AppModule.'
      );
    }
  }
}
