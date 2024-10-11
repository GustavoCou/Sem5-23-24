import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TaskRequestDTO } from 'src/app/dto/TaskRequestDTO';
import { RequestTaskMapper } from 'src/app/mapper/RequestTaskMapper';
import { requestTaskModel } from 'src/app/model/requestTaskModel';
import { HttpRequestsTaskService } from 'src/app/services/http-requests-task.service';

@Component({
  selector: 'app-status-task-approve',
  templateUrl: './status-task-approve.component.html',
  styleUrls: ['./status-task-approve.component.css']
})

export class StatusTaskApproveComponent {
  taskAprove: requestTaskModel[] = [];

  constructor(private location: Location,
    private http: HttpRequestsTaskService,
    private spinner: NgxSpinnerService,
    private toastUserMessage: ToastrService) { }

  ngOnInit() {
    this.aproveRequest();
  }

  aproveRequest() {
    this.http.getRequest('task/aprove').subscribe({
      next: (data) => {
        console.log(data);
        let requestDTOs: TaskRequestDTO[] = data.taskRequestDto;
        this.taskAprove = requestDTOs.map(requestDTO => RequestTaskMapper.toTaskModel(requestDTO));

        if (this.taskAprove.length == 0) {
          // Mostra mensagem de erro se não houver utentes
          this.toastUserMessage.info('Não existem requisiçoes aceites');
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  a lista
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar requisicoes com servidor a correr
          this.toastUserMessage.error('Erro ao carregar lista de utentes. Tente novamente mais tarde.', 'Erro');
          console.error('Erro:', err);
        }
      }
    });
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}

