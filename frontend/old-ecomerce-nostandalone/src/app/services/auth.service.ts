import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap }        from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User }       from '../models/user';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'jwtToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.url}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.url}/login`, data)
      .pipe(tap(res => localStorage.setItem(TOKEN_KEY, res.token)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated$(): Observable<boolean> {
    // podrías convertir esto a un BehaviorSubject si quieres observar cambios
    return new Observable(obs => {
      obs.next(this.isLoggedIn());
      obs.complete();
    });
  }
}
