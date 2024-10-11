import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpRequestsUsersService } from 'src/app/services/http-requests-users.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import UserDTO from 'src/app/dto/UserDTO';
import { UserModel } from 'src/app/model/userModel';
import { UserMapper } from 'src/app/mapper/UserMapper';

@Component({
  selector: 'app-export-data-file',
  templateUrl: './export-data-file.component.html',
  styleUrls: ['./export-data-file.component.css']
})
export class ExportDataFileComponent {
  userId: string = '';
  submitted = false;


  constructor(private location: Location,
    private http: HttpRequestsUsersService,
    private toastUserMessage: ToastrService,
  ) { }

  downloadUserData() {
    this.submitted = true;
    if (this.userId) {
      // console.log("cheguei ate aqui", this.userId);

      this.http.getRequest('Users/personaldata/' + this.userId).subscribe(
        data => {
          let userDto: UserDTO = data;
          let userModel: UserModel = UserMapper.toUserModel(userDto);

          this.toastUserMessage.success('Download do ficheiro com sucesso', 'Successo');
          this.downloadFile(userModel);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');

          }

          else if (error.status === 403) {
            this.toastUserMessage.error('Apenas utentes podem obter uma cópia dos dados pessoais');

          }
          else {
            let backendErrorMessage = error.error?.name;
            let errorMessage = 'Erro ao fazer o pedido. ' + (backendErrorMessage || 'email inválido/inexistente');
            this.toastUserMessage.error(errorMessage, 'Erro');
            console.error('Erro completo:', error);
          }
        }
      );
    }
  }

  private downloadFile(data: UserModel) {
    const json = JSON.stringify(data, null, 2); //para identar e colocar novas linhas
    //const json = JSON.stringify(data); //fica tudo seguido
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `UserData-${this.userId}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}