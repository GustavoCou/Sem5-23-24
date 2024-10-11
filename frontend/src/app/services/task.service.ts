import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Floor } from "../dto/floor";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TaskDTO } from "../dto/TaskDTO";
import { TaskRequestDTO } from "../dto/TaskRequestDTO";
import { JwtHelperService } from '@auth0/angular-jwt';
import { TaskSearchCriteria } from '../utils/types';

@Injectable({
	providedIn: 'root'
})
export class TaskService {
	private apiUrl = 'http://127.0.0.1:4001/api/task';

	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

	createTask(task: TaskDTO, method: string = 'post'): Observable<TaskRequestDTO> {

		let request: Observable<TaskRequestDTO>;
		const userId = this.getUserIdFromToken();

		if (userId == null) {
			console.error("Não foi possível obter o token da sessão.")
			return throwError('Falha na obtenção do token JWT.');
		} else {
			task.userId = userId;
		}


		if (method.toLowerCase() === 'post') {
			request = this.http.post<TaskRequestDTO>(this.apiUrl, task);
		} else {
			console.error('Método HTTP inválido. Use "post".');
			return throwError('Método HTTP inválido.');
		}


		return request.pipe(
			catchError((error) => {
				if (error.status === 404) {
					console.error('Endpoint não encontrado. Verifique a configuração do servidor.');
                    return throwError('Método HTTP inválido.');

				}

				if (error.status === 400) {

					return throwError(error.error);
				}

				return throwError(this.handleError(error));
			})
		);
	}

	public getTaskRequestList(criteria: TaskSearchCriteria): Observable<{ taskRequestDto: TaskRequestDTO[] }> {
		let request = this.http.post<{ taskRequestDto: TaskRequestDTO[] }>(this.apiUrl + "/filteredTasks", criteria);

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

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: envie o erro para a infraestrutura de log remoto
			console.error(`Erro na operação ${operation}:`, error);

			// Let the app keep running by returning an empty result.
			return throwError(result || 'Erro desconhecido');
		};
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
