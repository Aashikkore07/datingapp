import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { MemberList } from '../features/members/member-list/member-list';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';

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
    path: 'errors',
    component: TestErrors,
  },
  {
    path: 'server-error',
    component: ServerError,
  },
  {
    path: '**',
    component: NotFound,
  },
];
