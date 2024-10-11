import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent {
  showCreateBuilding: boolean = false;
  showEditBuilding: boolean = false;
  showListBuilding: boolean = false;
  showListMinMaxBuildingFloor: boolean = false;

constructor(private route: Router){}
 public resetShow(){
  this.showCreateBuilding = false;
  this.showEditBuilding  = false;
  this.showListBuilding  = false;
  this.showListMinMaxBuildingFloor = false;
}

backToMenu(): void {
  this.route.navigate(['/home']);
}
}
