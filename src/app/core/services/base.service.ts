import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '..';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  http = inject(HttpClient);

  /**
   * Sends a GET request to the specified URL and returns the response as an Observable.
   * @param url - The URL to send the request to.
   * @returns An Observable that emits the response data.
   */
  get<T>(url: string): Observable<T> {
    return this.http.get<BaseResponse>(url).pipe(
      map((m: BaseResponse) => {
        if (m.isFailure) {
          throw new Error('The request was not successful.');
        }
        return m.value;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a POST request to the specified URL with optional data and options, and returns the response as an Observable.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request (optional).
   * @param options - The options for the request (optional).
   * @returns An Observable that emits the response data.
   */
  post<T>(
    url: string,
    data?: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
    }
  ): Observable<T> {
    return this.http.post<BaseResponse>(url, data, options).pipe(
      map((m: BaseResponse) => {
        if (m.isFailure) {
          throw new Error('The request was not successful.');
        }
        return m.value;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a PUT request to the specified URL with optional data and returns the response as an Observable.
   * @param url - The URL to send the request to.
   * @param data - The data to send with the request (optional).
   * @returns An Observable that emits the response data.
   */
  put<T>(url: string, data?: any): Observable<T> {
    return this.http.put<BaseResponse>(url, data).pipe(
      map((m: BaseResponse) => {
        if (m.isFailure) {
          throw new Error('The request was not successful.');
        }
        return m.value;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a DELETE request to the specified URL and returns the response as an Observable.
   * @param url - The URL to send the request to.
   * @returns An Observable that emits the response data.
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<BaseResponse>(url).pipe(
      map((m: BaseResponse) => {
        if (m.isFailure) {
          throw new Error('The request was not successful.');
        }
        return m.value;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP error responses.
   * @param error - The HttpErrorResponse object representing the error.
   * @returns An Observable that emits the error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Error code: ${error.status}, ` + `message: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
