import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/User';
import { tap, using } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  currentUser = signal<User | null>(null);
  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', creds, { withCredentials: true })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
            console.log(user);
          }
        })
      );
  }
  refreshToken() {
    return this.http.post<User>(
      this.baseUrl + 'account/refresh-token',
      {},
      { withCredentials: true }
    );
  }
  startTokenRefreshInterval() {
    setInterval(() => {
      this.http
        .post<User>(this.baseUrl + 'account/refresh-token', {}, { withCredentials: true })
        .subscribe({
          next: (user) => {
            this.currentUser.set(user);
          },
          error: () => this.logout(),
        });
    }, 5 * 60 * 1000);
  }
  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    // localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }

  login(creds: LoginCreds) {
    return this.http
      .post<User>(this.baseUrl + 'account/login', creds, { withCredentials: true })
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  logout() {
    // localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
    this.likeService.clearLikeIds();
  }
  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decode = atob(payload);
    const jsonPayload = JSON.parse(decode);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
  }
}
