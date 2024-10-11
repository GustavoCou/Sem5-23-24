import { Component } from '@angular/core';
import { CreateElevatorComponent } from './create-elevator/create-elevator.component';
import { Router } from '@angular/router';


@Component({
	selector: 'app-elevator',
	templateUrl: './elevator.component.html',
	styleUrls: ['./elevator.component.css']
})

export class ElevatorComponent {
	showCreateElevator: boolean = false;
	showListFloorBuildingElevator: boolean = false;
	showListElevator: boolean = false;
	showEditElevator: boolean = false;

	constructor(private route: Router) { }

  	public resetShow() {
    	this.showCreateElevator = false;
    	this.showListFloorBuildingElevator = false;
    	this.showListElevator = false;
    	this.showEditElevator = false;
  	}

  	backToMenu(): void {
    	this.route.navigate(['/home']);
  	}
}

