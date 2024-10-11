import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TaskRequestDTO } from 'src/app/dto/TaskRequestDTO';
import { RequestTaskMapper } from 'src/app/mapper/RequestTaskMapper';
import { requestTaskModel } from 'src/app/model/requestTaskModel';
import { HttpRequestsTaskService } from 'src/app/services/http-requests-task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-task-not-approved',
  templateUrl: './list-task-not-approved.component.html',
  styleUrls: ['./list-task-not-approved.component.css']
})
export class ListTaskNotApprovedComponent {
  taskPending: requestTaskModel[] = [];

  constructor(private location: Location,
    private http: HttpRequestsTaskService,
    private spinner: NgxSpinnerService,
    private toastUserMessage: ToastrService,) { }

  ngOnInit() {
    this.pendingRequest();
  }

  approve(taskModel: requestTaskModel) {
    this.updateTaskStatus(taskModel, 'Approved');
  }

  reject(taskModel: requestTaskModel) {
    this.updateTaskStatus(taskModel, 'Disapproved');
  }

  pendingRequest() {
    this.http.getRequest('task/pending').subscribe({
      next: (data) => {
        console.log(data);
        let requestDTOs: TaskRequestDTO[] = data.taskRequestDto;
        this.taskPending = requestDTOs.map(requestDTO => RequestTaskMapper.toTaskModel(requestDTO));

        if (this.taskPending.length == 0) {
          // Mostra mensagem de erro se não houver utentes
          this.toastUserMessage.info('Não existem requisiçoes pendentes');
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  a lista
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar requisicoes com servidor a correr
          this.toastUserMessage.error('Erro ao carregar lista de tarefas. Tente novamente mais tarde.', 'Erro');
          console.error('Erro:', err);
        }
      }
    });
  }

  updateTaskStatus(taskModel: requestTaskModel, status: string) {
    this.spinner.show();

    this.http.putRequest(`/task/${taskModel.id}/status`, { status })
      .subscribe(
        data => {
          this.spinner.hide();
          this.toastUserMessage.success('Status atualizado com sucesso');
          this.pendingRequest();
        },
        error => {
          this.spinner.hide();
          this.toastUserMessage.error('Erro ao atualizar o status da tarefa');
          console.error('Erro:', error);
        }
      );
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}
