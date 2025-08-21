import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 400:
          if (error.error.errors) {
            const modelStateErrors = [];
            for (const key in error.error.errors) {
              if (error.error.errors[key]) {
                modelStateErrors.push(error.error.errors[key]);
              }
            }
            throw modelStateErrors.flat();
          } else {
            toast.error(error.error + ' ' + error.status);
          }
          // toast.error(typeof error.error != typeof 'string' ? error.error.title : error.error);
          break;
        case 401:
          toast.error('Unauthorized');
          break;
        case 404:
          toast.error('Not found');
          router.navigateByUrl('/not-found');
          break;
        case 401:
          toast.error('Unauthorized');
          break;
        case 500:
          const navigationExtras: NavigationExtras = { state: { error: error.error } };
          router.navigateByUrl('/server-error', navigationExtras);
          toast.error('Server Error');

          break;
        default:
          toast.error('Something went wrong');
          break;
      }
      throw error;
    })
  );
};
