import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import Robot  from '../dto/robot';


@Injectable({ providedIn: 'root' })
export class RobotService {
  private apiUrl = 'http://localhost:4000/api/robot';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }





  getRobots(): Observable<Robot[]> {
    const url = `${this.apiUrl}/list`;
    return this.http.get<Robot[]>(url);
  }

  updateRobotInhibitedStatus(id: string, inhibited: boolean): Observable<any> {
    const url = `${this.apiUrl}/edit`;
    return this.http.patch(url, { id, inhibited }, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: any) {
    // Your error handling logic here
    console.error('An error occurred', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
