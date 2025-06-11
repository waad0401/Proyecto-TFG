import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private base = `${environment.apiUrl}/config`;
  constructor(private http: HttpClient) {}

  /** Carga configuración dinámica del servidor */
  loadConfig() {
    return this.http.get(this.base);
  }
}
