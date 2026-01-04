import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserManagement } from './user-management/user-management';
import { PhotoManagement } from './photo-management/photo-management';

@Component({
  selector: 'app-admin',
  imports: [UserManagement, PhotoManagement],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  accountService = inject(AccountService);
  activeTab = 'photos';
  tabs = [
    { label: 'photo moderation', value: 'photos' },
    {
      label: 'user management',
      value: 'roles',
    },
  ];
  setTab(tab: string) {
    this.activeTab = tab;
  }
}
