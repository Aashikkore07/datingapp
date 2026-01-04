import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  init() {
    // const userString = localStorage.getItem('user');
    return this.accountService.refreshToken().pipe(
      tap((user) => {
        if (user) {
          this.accountService.setCurrentUser(user);
          this.accountService.startTokenRefreshInterval();
        }
      })
    );
    // const user = JSON.parse(userString);
    // return of(null);
  }
}
