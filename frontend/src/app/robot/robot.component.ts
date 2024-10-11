import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Robot from '../dto/robot';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.css']
})
export class RobotComponent {
  robots: Robot[] = [];
  showCreateRobot: boolean = false;
  //showEditRobot: boolean = false;
  showListRobot: boolean = false;

constructor(private route: Router){}
 public resetShow(){
  this.showCreateRobot = false;
  //this.showEditRobot  = false;
  this.showListRobot  = false;
}



backToMenu(): void {
  this.route.navigate(['/home']);
}
}
