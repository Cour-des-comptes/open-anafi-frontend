import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Report } from '../interfaces/report';



/**
 * Service component for report production services
 */

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(protected http: HttpClient) { }

  API: string = environment.API_URL;

  public makeReport(formValues: any): Observable<any> {
    return this.http.post(`${this.API}/reports/`, formValues, httpOptions)
    .pipe(
      catchError(this.handleError) // then handle the error
      );
  }

  public makeBalanceReport(formValues: any): Observable<any> {
    return this.http.post(`${this.API}/reports/balances/`, formValues, httpOptions)
    .pipe(
      catchError(this.handleError) // then handle the error
      );
  }

  public makeReportAgreggate(formValues: any): Observable<any> {
    return this.http.post(`${this.API}/reports/aggregates/`, formValues, httpOptions)
    .pipe(
      catchError(this.handleError) // then handle the error
      );
  }

  public getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.API}/reports/`)
    .pipe(
      catchError(this.handleError) // then handle the error
      );
  }

  public downloadReport(id: number): Observable<any> {

    return this.http.get(`${this.API}/reports/${id}/download/`, { observe: 'response', responseType: 'blob'})
    .pipe(
      catchError(this.handleError) // then handle the error
      );
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
      error);
  }

}
