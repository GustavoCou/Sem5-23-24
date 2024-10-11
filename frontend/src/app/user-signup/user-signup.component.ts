import {Component, Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpRequestsService} from 'src/app/services/http-requests.service';
import {ToastrService} from 'ngx-toastr';

import {UserService} from "../services/user.service";
import {UserView} from "../Domain/User/UserView";
import {UserMap} from "../mapper/UserMap";


@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})


export class UserSignUpComponent {


  formUser: FormGroup;

  constructor(private location: Location,
              private fb: FormBuilder,
              private http: HttpRequestsService,
              private toastrSrv: ToastrService,
              private userSrv: UserService
  ) {
    this.formUser = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      mechanographicNumber: ['', Validators.required],
      NIF: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue] // Requiere que checkbox esteja marcado

    });
  }

  goBack() {
    this.location.back();
  }

  onSubmitForm() {


    let user: UserView

    try {

      if (this.formUser.value.acceptTerms == false) {
        this.toastrSrv.info('Por favor aceita as condições de privacidade.');

      } else {
        user = UserView.createUser({
          nomeCompleto: this.formUser.value.fullname.toString(),
          email: this.formUser.value.email.toString(),
          password: this.formUser.value.password.toString(),
          func: "5", //utente
          telefone: this.formUser.value.phoneNumber.toString(),
          numMecanografico: this.formUser.value.mechanographicNumber.toString(),
          numeroContribuinte: this.formUser.value.NIF.toString()

        });

        if (user == null) {
          this.toastrSrv.error('Failed to create User. Verifique novamentente os dados\n', 'Error');
        } else {
          this.userSrv.createUtente(UserMap.toCreateDTO(user), 'post')
            .subscribe(
              floor => {
                this.location.back();
                this.toastrSrv.success('User criado com sucesso! \n A espera de confirmação pelo administrador ', 'Sucesso');

              },
              error => {

                this.toastrSrv.error(error.message, 'Erro');
              });
        }
      }
    } catch (e) {


      this.toastrSrv.error((e as Error).message, 'Erro');
    }


  }


}
