import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

interface LoginResponse { token: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password })
      .pipe(tap(res => localStorage.setItem(environment.jwtTokenKey, res.token)));
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.base}/register`, { name, email, password });
  }

  logout() {
    localStorage.removeItem(environment.jwtTokenKey);
  }

  isAuthenticated$() {
    // Podrías implementar un BehaviorSubject para emitir cambios
    return this.http.get<boolean>(`${this.base}/is-authenticated`);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }
}
