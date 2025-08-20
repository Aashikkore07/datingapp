import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { MemberList } from '../features/members/member-list/member-list';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberList,
        canActivate: [authGuard],
      },
      {
        path: 'members/:id',
        component: MemberDetailed,
        canActivate: [authGuard],
      },
      {
        path: 'lists',
        component: Lists,
        canActivate: [authGuard],
      },
      {
        path: 'messages',
        component: Messages,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    component: Home,
  },
];
