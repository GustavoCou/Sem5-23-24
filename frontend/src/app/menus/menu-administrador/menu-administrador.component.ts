import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-administrador',
  templateUrl: './menu-administrador.component.html',
  styleUrls: ['./menu-administrador.component.css']
})

export class MenuAdministradorComponent {
  title = 'RobDroneGo';
  showAdministracaoSistema: boolean = false;
  showGestaoUtilizador: boolean = false;
  showMenu3D: boolean = false;
}
