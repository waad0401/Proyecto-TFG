import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface LoginResponse { token: string; /* otros campos si tu API los devuelve */ }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Llama a POST /auth/login
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password });
  }

  // Llama a POST /auth/register
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.base}/register`, { name, email, password });
  }

  // Otros métodos: logout(), isAuthenticated(), getToken(), etc.
}
