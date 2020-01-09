import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, throwError} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { MatomoTracker } from 'ngx-matomo';


/**
 * Service component for authentification services
 */

const ANONYMOUS_USER = <User>{
    username: '',
    name: '',
    givenName: '',
    mail: '',
    company: '',
    department: '',
    isAdmin: false
};

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
    constructor(private http: HttpClient, private cookieService: CookieService, private matomoTracker: MatomoTracker) { }

    public authenticatedUser: BehaviorSubject<User> = new BehaviorSubject<User>(ANONYMOUS_USER);

    routerlink = new Subject<string>();

    /**
     * Identify user with username and password
     * @example
     * login(pLaurent,12345)
     *
     * @param {string} username user ident
     * @param {string} password user password
     * @returns  authentifaction token
     */
    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.API_URL}/users/authenticate/`, { username: username, password: password })
            .pipe(map((data: any) => {
                // login successful if there's a jwt token in the response
                if (data && data.token) {

                    const expire = new Date();
                    expire.setHours(expire.getHours() + 12);
                    this.cookieService.set('token_access', data.token, expire);
                }
            }),
                catchError(this.handleError) // then handle the error
            );
    }
    /**
     * Get user informations
     * @returns  'User' created from backend informations
     */
    getUserInfos(): Observable<User> {
        return this.http.get<User>(`${environment.API_URL}/users/authenticate/`)
            .pipe(
                map(userJson => {
                    const newUser = <User>(userJson);
                    this.authenticatedUser.next(newUser);
                    return newUser;
                }),
                catchError(this.handleError) // then handle the error
            );
    }
    /**
     * Return authentificated user
     * @returns User
     */
    public getAuthenticatedUser(): Observable<User> {
        return this.authenticatedUser;
    }

    /**
     * Check if user is connected
     * @returns Boolean
     */
    public isUserConnected(): boolean {
        return this.cookieService.check('token_access');
    }

    /**
     * Disconnect a user and delete all cookies
     */
    public logout() {
        this.authenticatedUser.next(ANONYMOUS_USER);
        this.deleteCookie();
    }

    /**
     * Delete 'token_access' cookie
     */
    public deleteCookie() {
        this.cookieService.delete('token_access');
    }

    /**
     *Get a cookie by its name
     * @example
     * getCookieJwt("token_access")
     *
     * @param {string} data cookie's name
     * @returns cookie's data
     */
    public getCookieJwt(data: string): string {
        return this.cookieService.get(data);
    }

  public setRouteLink(routerlink: string) {
        this.routerlink.next(routerlink);
    }

    public getRouteLink(): Observable<any> {
        return this.routerlink.asObservable();
    }


    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'An Error from backend occured )-=');
    }

}
