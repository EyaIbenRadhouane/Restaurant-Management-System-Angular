import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = `${environment.apiUrl}/${environment.prefix}/auth`;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { username, password }).pipe(
      tap((res: any) => {
        this.setItem('token', res.token);
        this.setItem('username', res.username);
        this.setItem('role', res.role);
      })
    );
  }

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.url}/register`, { username, password, role });
  }

  logout(): void {
    this.removeItem('token');
    this.removeItem('username');
    this.removeItem('role');
  }

  // ✅ Toujours vérifier qu'on est dans le navigateur
  private setItem(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  private removeItem(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
  }

  private getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  getToken(): string | null    { return this.getItem('token'); }
  getRole(): string | null     { return this.getItem('role'); }
  getUsername(): string | null { return this.getItem('username'); }
  isLoggedIn(): boolean        { return !!this.getToken(); }
  isAdmin(): boolean           { return this.getRole() === 'admin'; }
  isClient(): boolean          { return this.getRole() === 'client'; }
}