import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-utente',
  templateUrl: './menu-utente.component.html',
  styleUrls: ['./menu-utente.component.css']
})

export class MenuUtenteComponent {
  title = 'RobDroneGo Utente';
  
  showInformacao: boolean = false;
  showGestaoUsers: boolean = false;
  
}
