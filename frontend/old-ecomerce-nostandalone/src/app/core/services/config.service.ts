// src/app/core/services/config.service.ts
import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl:    string;
  imageBase: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config?: AppConfig;

  constructor(private http: HttpClient) {}

  /**
   * Carga /assets/config.json y guarda el resultado en this.config.
   * Devuelve una promesa que se resuelve al cargar.
   */
  load(): Promise<void> {
    return firstValueFrom(
      this.http.get<AppConfig>('/assets/config.json')
    ).then(cfg => {
      this.config = cfg;
    });
  }

  /** Acceso seguro a apiUrl tras load() */
  get apiUrl(): string {
    if (!this.config) {
      throw new Error('ConfigService: config no cargada aún');
    }
    return this.config.apiUrl;
  }

  /** Acceso seguro a imageBase tras load() */
  get imageBase(): string {
    if (!this.config) {
      throw new Error('ConfigService: config no cargada aún');
    }
    return this.config.imageBase;
  }
}
