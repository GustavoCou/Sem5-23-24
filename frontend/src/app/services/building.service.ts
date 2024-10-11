import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Building from '../dto/building';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiUrl = 'http://localhost:4000/api/building';

  constructor(private http: HttpClient) {}

  // Método para obter a lista de edifícios do backend
  getBuildings(): Observable<Building[]> {
    const url = `${this.apiUrl}/list`;
    return this.http.get<Building[]>(url);
  }
}