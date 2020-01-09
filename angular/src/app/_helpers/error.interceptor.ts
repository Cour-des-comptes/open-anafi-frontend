import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';

import { AuthentificationService } from '../services/authentification.service';
import {CustomAlertService} from '../services/alerts/custom-alert.service';
import {CustomNotification} from '../interfaces/customNotification';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router,
                private authenticationService: AuthentificationService,
                private customAlertService: CustomAlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {
            if ( err instanceof HttpErrorResponse && err.status === 401) {
                 this.authenticationService.logout();
                 this.router.navigate(['/login']);

                 this.customAlertService.setNotification({
                   message: `Échec de la connexion`,
                   type: `error`
                 });
                 return throwError(err);
            }

            const error: CustomNotification = {
              message: err.error.detail,
              type: 'error'
            };

            this.customAlertService.setNotification(error);

            // const error = err.error.message || err.statusText;
             return throwError(err);
        }));
    }
}
