import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import UserDTO from '../dto/UserDTO';
import { TaskDTO } from '../dto/TaskDTO';
import { TaskRequestDTO } from '../dto/TaskRequestDTO';
import { environmentsTasks } from 'src/environments/environmentsTask';
@Injectable({
    providedIn: 'root',
})

export class HttpRequestsTaskService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    baseUrl = environmentsTasks.apiUrl + '/api/';

    getRequest(addr: string): Observable<any> {
      return this.http.get(this.baseUrl + addr);
    }

    putRequest(addr: string, data: any): Observable<any> {
      return this.http.put(this.baseUrl + addr, data);
    }

    showTost(severity: string, summary: string, detail: string, life: number = 5000) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail,
            life: life,
        });
    }

    reload() {
        window.location.reload();
    }
}
