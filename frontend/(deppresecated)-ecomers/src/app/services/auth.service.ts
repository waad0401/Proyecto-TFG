import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { environment } from '../environments/environment';

interface LoginResponse { token: string; }
interface UserPayload { id: string; email: string; exp: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserPayload|null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(environment.jwtTokenKey);
    if (token) this.setUserFromToken(token);
  }

  login(email: string, password: string): Observable<UserPayload> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => localStorage.setItem(environment.jwtTokenKey, res.token)),
        map(res => this.setUserFromToken(res.token))
      );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password });
  }

  logout() {
    localStorage.removeItem(environment.jwtTokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  private setUserFromToken(token: string): UserPayload {
    const user = jwtDecode<UserPayload>(token);
    this.currentUserSubject.next(user);
    return user;
  }
}
