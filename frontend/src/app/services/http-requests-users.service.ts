import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environmentsUser } from 'src/environments/environmentsUser';
import UserDTO from '../dto/UserDTO';
@Injectable({
    providedIn: 'root',
})
export class HttpRequestsUsersService {
    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }
    baseUrl = environmentsUser.apiUrl + '/api/';

    getRequest(addr: string): Observable<any> {
        return this.http.get(this.baseUrl + addr);
    }
    postRequest(addr: string, Data: any): Observable<any> {
        return this.http.post(this.baseUrl + addr, Data);
    }
    putRequest(addr: string, Data: any): Observable<UserDTO> {
        return this.http.put<UserDTO>(this.baseUrl + addr, Data);
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
