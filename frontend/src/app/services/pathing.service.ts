import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PathingService {

	private apiUrl = 'http://localhost:4000';

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(private http: HttpClient) { }

	melhorCaminhoPisos(floorOrigin: string, floorTarget: string): Observable<any> {
		const url = `${this.apiUrl}/melhorCaminhoPisos`;
		let request: Observable<any> = this.http.post<any>(url, {}, { params: { pisoOrigem: floorOrigin, pisoDestino: floorTarget } });

		return request.pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			console.error(
				`Backend returned code ${error.status}, body was: `, error.error);
		}
		// Return an observable with a user-facing error message.
		return throwError(() => new Error(error.error));
	}

}
