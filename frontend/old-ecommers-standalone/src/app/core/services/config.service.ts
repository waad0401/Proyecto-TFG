import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AppConfig {
  apiUrl:    string;
  imageBase: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config!: AppConfig;
  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return this.http
      .get<AppConfig>('/assets/config.json')
      .toPromise()
      .then(cfg => this.config = cfg);
  }

  get apiUrl(): string    { return this.config.apiUrl; }
  get imageBase(): string { return this.config.imageBase; }
}
