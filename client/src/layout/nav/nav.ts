import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private router = inject(Router);
  protected accountService = inject(AccountService);
  protected creds: any = {};
  private toast = inject(ToastService);
  // protected loggedIn = signal(false);
  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success('Logged in successfully');
        this.creds = {};
      },
      error: (er) => {
        this.toast.error(er.error);
      },
    });
  }
  logout() {
    this.accountService.logout();
    this.toast.success('Logged out successfully');
    this.router.navigateByUrl('/');
  }
}
