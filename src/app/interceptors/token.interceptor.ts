import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import {
    Router
  } from '@angular/router';
  import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        public toastController: ToastController
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('ACCESS_TOKEN');
      
        if (token) {
          request = request.clone({
            setHeaders: {
              'Authorization': 'Bearer ' + token,
              'Accept': "application/json"
            }
          });
        }
        // console.warn(token);
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
      
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
      
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('event--->>>', event);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              if (error.error.success === false) {
                console.log('Login failed');
              } else {
                this.router.navigate(['login']);
              }
            }
            return throwError(error);
          }));
      }

}