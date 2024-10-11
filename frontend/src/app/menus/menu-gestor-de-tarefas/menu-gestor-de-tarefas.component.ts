import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-gestor-de-tarefas',
  templateUrl: './menu-gestor-de-tarefas.component.html',
  styleUrls: ['./menu-gestor-de-tarefas.component.css']
})

export class MenuGestorDeTarefasComponent {
  title = 'RobDroneGo';
  showMenu3D: boolean = false;
  showAdministracaoSistema: boolean = false;
  showInformacao: boolean = false;
  showGestaoUsers: boolean = false;
 
}
