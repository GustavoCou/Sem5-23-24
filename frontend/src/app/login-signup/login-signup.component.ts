import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserDTO from '../dto/UserDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignUpComponent {
  users: UserDTO[] = [];
  showSignUp: boolean = false;
  showLogin: boolean = false;
  showPopup: boolean = false;

  constructor(private route: Router, private toastrSrv: ToastrService){}

  public resetShow(){
    this.showSignUp = false;
    this.showLogin  = false;
  }

  ngOnInit() {
    this.showPopup = true;
  }

  acceptAll() {
    this.showPopup = false;
    this.route.navigate(['/home'])
  }

  async deny() {
    this.showPopup = false;

    await new Promise<void>(resolve => {
        this.toastrSrv.info('Infelizmente não poderá avançar no nosso sistema sem aceitar os nossos cookies e a nossa Política de Privacidade de Dados!');
        resolve();
    });
    this.showPopup = true;
}

}
