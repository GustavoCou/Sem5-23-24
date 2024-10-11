import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent {
  showApproveRejectUser: boolean = false;
  constructor(private route: Router) { }

  public resetShow() {
    this.showApproveRejectUser = false;

  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }
}