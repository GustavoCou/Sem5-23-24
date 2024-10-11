import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  showCreateTask: boolean = false;
  showListTask: boolean = false;
  showFilteredTaskList: boolean = false;
  showListTaskApprove: boolean = false;
  showListTaskOrder: boolean = false;

  constructor(private route: Router) { }

  public resetShow() {
    this.showCreateTask = false;
    this.showListTask = false;
    this.showFilteredTaskList = false;
    this.showListTaskApprove = false;
    this.showListTaskOrder = false;
  }

  backToMenu(): void {
    this.route.navigate(['/home']);
  }
}
