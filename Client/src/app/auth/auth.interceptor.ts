import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   *
   */
  constructor(private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const clonedRequest = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('token')
        ),
      });
      return next.handle(clonedRequest).pipe(
        tap(
          (suc) => {},
          (err) => {
            if (err.status == 401) {
              localStorage.removeItem('token');
              this.router.navigateByUrl('/user/login');
            }
          }
        )
      );
    } else {
      return next.handle(req.clone());
    }
  }
}
