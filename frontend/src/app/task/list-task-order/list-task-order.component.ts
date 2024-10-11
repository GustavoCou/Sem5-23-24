import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpTaskARequestService } from 'src/app/services/task_request.service';

@Component({
  selector: 'app-list-task-order',
  templateUrl: './list-task-order.component.html',
  styleUrls: ['./list-task-order.component.css']
})
export class ListTaskOrderComponent {
  solucaoTarefas: string[] = [];
  custoCaminho: number | null = null;


  constructor(
    private location: Location,
    private http: HttpTaskARequestService,
    private toastrSrv: ToastrService,
  ) { }

  public obterPercursoTarefas(): void {

    this.http.getRequest('/find').subscribe(
      (response: any) => {
        console.log(response);
        this.solucaoTarefas = response.solution;
        this.custoCaminho = response.custo; // Armazena o custo recebido
        this.toastrSrv.success('Percurso de tarefas obtido com sucesso!');
      },
      (error) => {
        console.error(error);
        this.toastrSrv.error('Erro ao obter o percurso de tarefas!');
      }
    );
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}
