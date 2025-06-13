// src/app/core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ConfigService } from './services/config.services';
import { LoggerService } from './services/logger.services';

@NgModule({
  providers: [
    ConfigService,
    LoggerService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule ya ha sido cargado. Importalo solo en AppModule.'
      );
    }
  }
}
