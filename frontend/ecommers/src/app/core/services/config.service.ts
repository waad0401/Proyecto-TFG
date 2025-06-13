// src/app/core/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl:    string;
  imageBase: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: AppConfig;

  constructor(private http: HttpClient) {}

  /** Debe llamarse en APP_INITIALIZER */
  load(): Promise<void> {
    return firstValueFrom(
      this.http.get<AppConfig>('/assets/config.json')
    ).then(cfg => this.config = cfg);
  }

  get apiUrl(): string {
    if (!this.config) throw new Error('Config no cargado');
    return this.config.apiUrl;
  }

  get imageBase(): string {
    if (!this.config) throw new Error('Config no cargado');
    return this.config.imageBase;
  }
}
