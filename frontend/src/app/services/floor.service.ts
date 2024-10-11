import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { Floor } from '../dto/floor';


@Injectable({ providedIn: 'root' })
export class FloorService {
  private apiUrl = 'http://localhost:4000/api/floor';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http: HttpClient) {}
  
  createFloor(floor: Floor, method: string = 'post'): Observable<Floor> {
    const url = `${this.apiUrl}/create`;
    let request: Observable<Floor>;

    if (method.toLowerCase() === 'post') {
      request = this.http.post<Floor>(url, floor);
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
          if (error.error && error.error.error === 'Invalid floor data') {
            console.error('Dados inválidos ao editar o floor');
            return throwError('Dados inválidos ao editar o floor');
          } else if (error.error && error.error.error === 'Building mismatch') {
            console.error('Edifício fornecido não corresponde ao edifício associado ao piso');
            return throwError('Edifício fornecido não corresponde ao edifício associado ao piso');
          }
        }
        return throwError(this.handleError(error));
      })
    );
  }  
  

  updateFloor(floor: Floor, method: string = 'patch'): Observable<Floor> {
    const url = `${this.apiUrl}/edit`;
    let request: Observable<Floor>;
  
    if (method.toLowerCase() === 'patch') {
      request = this.http.patch<Floor>(url, floor);
    } else if (method.toLowerCase() === 'put') {
      request = this.http.put<Floor>(url, floor);
    } else {
      console.error('Método HTTP inválido. Use "patch" ou "put".');
      return throwError('Método HTTP inválido.');
    }
  
    return request.pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.error('Endpoint não encontrado. Verifique a configuração do servidor.');
        }

        if (error.status === 400) {
          if (error.error && error.error.error === 'Invalid floor data') {
            console.error('Dados inválidos ao editar o floor');
            return throwError('Dados inválidos ao editar o floor');
          } else if (error.error && error.error.error === 'Building mismatch') {
            console.error('Edifício fornecido não corresponde ao edifício associado ao piso');
            return throwError('Edifício fornecido não corresponde ao edifício associado ao piso');
          }
        }
        return throwError(this.handleError(error));
      })
    );
  }  

  getFloors(): Observable<Floor[]> {
    const url = `${this.apiUrl}/get`;
    return this.http.get<Floor[]>(url);
  }
  
  getFloorsByBuildingId(buildingId :string): Observable<Floor[]> {
    const url = `${this.apiUrl}/get/${buildingId}`;
    return this.http.get<Floor[]>(url);
  }

  uploadMap(formData : FormData){
    const url = `${this.apiUrl}/uploadmap`;
    return this.http.patch(url,formData);
  }

  getBuildingsInFloorRange(minFloors: number, maxFloors: number): Observable<any[]> {
    const url = `${this.apiUrl}/floorsInRange?minFloors=${minFloors}&maxFloors=${maxFloors}`;
    return this.http.get<any[]>(url);
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
  