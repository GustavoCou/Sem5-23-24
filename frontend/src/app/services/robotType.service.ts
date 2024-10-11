import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { RobotType } from '../dto/robotType';

@Injectable({ providedIn: 'root' })
export class RobotTypeService {
    private apiUrl = 'http://localhost:4000/api/robotType';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http: HttpClient) {}

  createRobotType(robotType: RobotType, method: string = 'post'): Observable<RobotType> {
    const url = `${this.apiUrl}/create`;
    let request: Observable<RobotType>;
  
    if (method.toLowerCase() === 'post') {
      request = this.http.post<RobotType>(url, robotType);
    } else {
      console.error('Método HTTP inválido. Use "post".');
      return throwError('Método HTTP inválido.');
    }
  
    return request.pipe(
      catchError((error) => {
        console.error('Error:', JSON.stringify(error)); 
        
        if (error.status === 402) {
          console.error('Tipo de Robô já existe ou excede o comprimento máximo.');
          return throwError('Tipo de Robô já existe ou excede o comprimento máximo.');
        }

        if (error.status === 404) {
          console.error('Endpoint não encontrado. Verifique a configuração do servidor.');
        }

        if (error.status === 400) {
          if (error.error && error.error.error === 'Invalid robotType data') {
            console.error('Dados inválidos ao criar o robotType');
            return throwError('Dados inválidos ao criar o robotType');
          } 
        }
        return throwError(this.handleError(error));
      })
    );
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: envie o erro para a infraestrutura de log remoto
      console.error(`Erro na operação ${operation}:`, error);

      // Let the app keep running by returning an empty result.
      return throwError(result || 'Erro desconhecido');
    };
  }
}