import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import UserDTO from '../dto/UserDTO';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserModel } from '../model/userModel';

@Injectable({ providedIn: 'root' })
export class UserService {
	private apiUrl = 'http://127.0.0.1:5000/api/Users';//to review

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(
		private http: HttpClient,
		private jwtHelper: JwtHelperService) { }

	createUtente(user: UserDTO, method: string = 'post'): Observable<UserDTO> {

		let request: Observable<UserDTO>;

		if (method.toLowerCase() === 'post') {
			request = this.http.post<UserDTO>(this.apiUrl, user);
		} else {
			console.error('Método HTTP inválido. Use "post".');
			return throwError('Método HTTP inválido.');
		}

		return request.pipe(
			catchError((error) => {
				if (error.status === 404) {
					console.error('Endpoint não encontrado. Verifique a configuração do servidor.');
				}

				if (error.status === 400) {

					return throwError(error.error);
				}

				return throwError(this.handleError(error));
			})
		);
	}

	public getAllUsers(): Observable<UserModel[]> {
		let request = this.http.get<UserModel[]>(this.apiUrl);

		return request.pipe(catchError(this.handleError2));
	}

	public cancelUtente(): Observable<UserDTO> {
		const userId = this.getUserIdFromToken();
		console.log(userId);

		let request: Observable<UserDTO> = this.http.put<UserDTO>(this.apiUrl + "/" + userId, {});

		return request.pipe(catchError(this.handleError2));
	}

	private getUserIdFromToken(): string | null {
		const token = localStorage.getItem("token");
		console.log(token);

		if (token) {
			const decodedToken = this.jwtHelper.decodeToken(token);
			console.log(decodedToken);
			return decodedToken ? decodedToken.sid : null;
		}

		return null;
	}

	private handleError(error: any) {
		// Your error handling logic here
		console.error('An error occurred', error);
		return throwError(() => new Error('Something bad happened; please try again later.'));
	}

	private handleError2(error: HttpErrorResponse) {
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
