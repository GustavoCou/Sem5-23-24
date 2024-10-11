import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  title = 'RobDroneGo';
  showMenu3D: boolean = false;
  showAdministracaoSistema: boolean = false;
  showInformacao: boolean = false;
  showGestaoUsers: boolean = false;
  showSignUpLogin: boolean = false;
  showManageUsers: boolean = false;
}
