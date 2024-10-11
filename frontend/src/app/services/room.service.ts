import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../dto/room';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RoomService {

	private apiUrl = 'http://localhost:4000/api/room';

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(private http: HttpClient) { }

	createRoom(room: Room): Observable<Room> {
		const url = `${this.apiUrl}/create`;
		let request: Observable<Room> = this.http.post<Room>(url, room);

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
