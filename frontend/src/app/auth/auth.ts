import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'user';
  private tokenKey = 'access_token';
  private loggedInSubject = new BehaviorSubject<boolean>(!!this.getUser());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
  return this.http.post<{ user: any; access_token: string }>(
    'http://localhost:3000/auth/login',
    { email, password }
  ).pipe(
    tap(res => {
      if (res.user && res.access_token) {
        localStorage.setItem('user', JSON.stringify(res.user));
  localStorage.setItem('access_token', res.access_token);
      }
    })
  );
}


  register(data: { name: string; email: string; password: string }) {
    return this.http.post<{ user: any }>('http://localhost:3000/auth/register', data);
  }

  setUser(user: any, token: string) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
  }

getToken(): string | null {
  return localStorage.getItem('access_token');
}

  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }
}
