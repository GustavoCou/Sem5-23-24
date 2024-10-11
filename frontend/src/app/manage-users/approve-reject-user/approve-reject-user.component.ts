import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import UserDTO from 'src/app/dto/UserDTO';
import { HttpRequestsUsersService } from 'src/app/services/http-requests-users.service';
import { Location } from '@angular/common';
import { UserModel } from 'src/app/model/userModel';
import { UserMapper } from 'src/app/mapper/UserMapper';


@Component({
  selector: 'app-approve-reject-user',
  templateUrl: './approve-reject-user.component.html',
  styleUrls: ['./approve-reject-user.component.css']
})
export class ApproveRejectUserComponent {
  user: UserModel[] = [];

  constructor(private location: Location,
    private http: HttpRequestsUsersService,
    private spinner: NgxSpinnerService,
    private toastUserMessage: ToastrService,) { }

  ngOnInit() {
    this.pendingUtentes();
  }

  approve(utente: UserDTO) {
    utente.approvalStatus = 1; // Aprovado
    this.http.putRequest(`Users/${utente.email}/updatestatus`, utente).subscribe({
      next: () => {
        this.toastUserMessage.success('Pedido de registo aceite com sucesso');

        this.user = this.user.filter(u => u.email !== utente.email);
      },
      error: (err) => {
        if (err.status === 0) {
          //erro de conexao 
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          console.log("EROOOOOOO----------------------------------------O");

          this.toastUserMessage.error('Erro ao aprovar usuário');
          console.error('Erro:', err);
        }
      }
    });
  }

  reject(utente: UserDTO) {
    utente.approvalStatus = 2; // Rejeitado
    this.http.putRequest(`Users/${utente.email}/updatestatus`, utente).subscribe({
      next: () => {
        this.toastUserMessage.success('Pedido de registo recusado com sucesso');

        this.user = this.user.filter(u => u.email !== utente.email);
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao 
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          this.toastUserMessage.error('Erro ao rejeitar usuário');
          console.error('Erro:', err);
        }
      }
    });
  }



  pendingUtentes() {
    this.http.getRequest('Users/PendingUtentes').subscribe({
      next: (data) => {

        let userDto: UserDTO[] = data;
        this.user = userDto.map(userDto => UserMapper.toUserModel(userDto));

        if (this.user.length == 0) {
          // Mostra mensagem de erro se não houver utentes
          this.toastUserMessage.info('Não existem utentes pendentes de aceitação');
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  a lista
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar users com servidor a correr
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
