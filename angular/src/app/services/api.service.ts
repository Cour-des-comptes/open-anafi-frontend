import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Comment } from '../interfaces/comment';
import { Nomenclature } from '../interfaces/nomenclature';
import { Frame } from '../interfaces/frames';
import { Indicator } from '../interfaces/indicator';
import { Identifier } from '../interfaces/identifier';
import { Department } from '../interfaces/department';
import { Institution } from '../interfaces/institution';
import { IdentifierType } from '../interfaces/identifier_type';
import { Parameter } from '../interfaces/parameter';

/**
 * Service component for api services
 */

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
    // 'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class apiService {

  constructor(protected http: HttpClient) { }

  API: string = environment.API_URL;


  /**
   * Get all the nomenclatures
   * @returns  Nomenclature[]
   */
  public getNomenclatures(): Observable<Nomenclature[]> {
    return this.http.get<Nomenclature[]>(`${this.API}/nomenclatures/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  /**
 * Get all the indicators
 * @returns  Indicator[]
 */
  public getIndicators(): Observable<Indicator[]> {
    return this.http.get<Indicator[]>(`${this.API}/indicators/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  /**
 * Get all the indicators parameters
 * @returns  Parameter[]
 */
  public getIndicatorParameters(): Observable<Parameter[]> {
    return this.http.get<Parameter[]>(`${this.API}/indicators/parameters/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  /**
* Get all the frames
* @returns  Frame[]
*/
  public getFrames(): Observable<Frame[]> {
    return this.http.get<Frame[]>(`${this.API}/frames/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  /**
* Get all the identifiers types
* @returns IdentifierType[]
*/
  public getIdentifierTypes(): Observable<IdentifierType[]> {
    return this.http.get<IdentifierType[]>(`${this.API}/identifier_types/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  /**
   * Create a comment with the username of the user
   * @example
   * login(pLaurent,"Best app ever !")
   *
   * @param {string} username user identifier
   * @param {string} comment comment text
   */
  public setComment(username: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.API}/comments/app/`, { 'username': username, 'comment': comment }, httpOptions)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * Get all comments
   *
   * @returns Comment[]
   */
  public getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API}/comments/app/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  /**
 * Get Frame Comments
 *@param {number} id frame id
 *
 * @returns Comment[]
 */
  public getFrameComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API}/comments/frames/?frame=${id}`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  /**
 * Get Indicator Comments
 *@param {number} id indicator id
 *
 * @returns Comment[]
 */
  public getIndicatorComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API}/comments/indicators/?indicator=${id}`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }



  /**
   * Create a comment for a frame with the username of the user
   * @example
   * login(pLaurent,"Best frame ever !", 1560)
   *
   * @param {string} username user identifier
   * @param {string} comment comment text
   * @param {number} id frame id
   *
   * @returns Comment[]
   */
  public setFrameComment(username: string, comment: string, id: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.API}/comments/frames/`, { 'username': username, 'comment': comment, 'frame': id }, httpOptions)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  /**
 * Create a comment for an indicator with the username of the user
 * @example
 * login(pLaurent,"Best indicator ever !", 22156)
 *
 * @param {string} username user identifier
 * @param {string} comment comment text
 * @param {number} id indicator id
 *
 * @returns Comment[]
 */
  public setIndicatorComment(username: string, comment: string, id: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.API}/comments/indicators/`,
      { 'username': username, 'comment': comment, 'indicator': id }, httpOptions)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  /**
* Get filtered identifiers
* @param {string} type identifiers type
* @param {string[]} department filter department
* @param {number[]} institution filter department
*
* @returns Identifier[]
*/
  public getIdentifiers(type: string, department: string[], institution: number[]): Observable<Identifier[]> {

    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('type', type);
    // params = params.append('department', ('000' + department).substr(-3));
    params = params.append('department', department.toString());
    params = params.append('institutions', institution.toString());

    // Make the API call using the new parameters.
    return this.http.get<Identifier[]>(`${this.API}/identifiers/`, { params: params });

  }

  public getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.API}/departments/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  public getInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>(`${this.API}/institutions/`)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  ///////// CREATION////////

  public setFrame(formdata: FormData): Observable<any> {
    return this.http.post<any>(`${this.API}/frames/`, formdata);
  }

  public editFrame(id: number, formdata: FormData): Observable<any> {
    return this.http.put<any>(`${this.API}/frames/${id}/`, formdata);
  }
  public deleteFrame(id: number): Observable<any> {
    return this.http.delete(`${this.API}/frames/${id}/`);
  }
  public exportFrame(id: number): Observable<any> {
    return this.http.get(`${this.API}/downloadframe/${id}/`, { observe: 'response', responseType: 'blob'})
      .pipe(
      catchError(this.handleError) // then handle the error
      );
  }

  public exportFrameLight(id: number): Observable<any> {
    return this.http.get(`${this.API}/downloadframelight/${id}/`, { observe: 'response', responseType: 'blob'})
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  public setFrameIndicator(id: number, formValues: any, operation: any): Observable<any> {
    return this.http.post<any>(`${this.API}/frames/${id}/indicators/`, { formValues, operation }, httpOptions);
  }

  public setNomenclature(formValues: any): Observable<any> {
    return this.http.post(`${this.API}/nomenclatures/`, formValues, httpOptions);
  }

  public editNomenclature(id: number, formValues: any): Observable<any> {
    return this.http.put(`${this.API}/nomenclatures/${id}/`, formValues, httpOptions);
  }

  public deleteNomenclature(id: number): Observable<any> {
    return this.http.delete(`${this.API}/nomenclatures/${id}/`);
  }

  public deleteIndicator(id: number): Observable<any> {
    return this.http.delete(`${this.API}/indicators/${id}/`);
  }

  public createIndicator(formValues: any): Observable<any> {
    return this.http.post(`${this.API}/indicators/`, formValues, httpOptions);
  }

  public editIndicator(id: number, formValues: any): Observable<any> {
    return this.http.put(`${this.API}/indicators/${id}/`, formValues, httpOptions);
  }

  public checkParameter(parameter: any):  Observable<any> {
    return this.http.post(`${this.API}/equation/parse/`, parameter, httpOptions);
  }
  public createGraph(id: number): Observable<any> {
    return this.http.get(`${this.API}/indicators/parameters/${id}/tree/`);
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
        `body was: ${error.error.detail}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'An Error from backend occured )-=');
  }

}
