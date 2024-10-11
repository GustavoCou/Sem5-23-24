import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ElevatorService } from 'src/app/services/elevator.service';
import { Elevator } from 'src/app/dto/elevator';
import { BuildingService } from 'src/app/services/building.service';
import Building from 'src/app/dto/building';
import { Floor } from 'src/app/dto/floor';
import { FloorService } from 'src/app/services/floor.service';

@Component({
  selector: 'app-list-floors-building',
  templateUrl: './list-floors-building.component.html',
  styleUrls: ['./list-floors-building.component.css']
})
export class ListFloorsBuildingComponent {
  buildingId: any;
  elevatorList: Elevator[] = [];
  buildingsList: Building[]=[];
  showForm = true;

  constructor(private location: Location, private elevatorService: ElevatorService, private buildingService: BuildingService, private toastrSrv: ToastrService) 
  { this.loadBuildings() }

  ngOnInit() {
  }

  backToMenu(){
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

  loadBuildings() {
    this.buildingService.getBuildings()
    .subscribe(buildings => {
        this.buildingsList = buildings;
      },
      error => {
        this.toastrSrv.error('Erro ao carregar edifícios', 'Erro');
        console.error('Erro ao carregar edifícios', error);
      });
  }

  getFloorsServed(): void {
    this.elevatorService.getFloorsBuildingElevator(this.buildingId).subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.elevatorList = data;
          this.elevatorList.forEach((elevator) => {
            console.log('getFloorsServed: Processing elevator', elevator);
          });
        } else {
          this.toastrSrv.warning('Nenhum dado disponível!', 'Warning');
        }
      },
      error: (err) => {
        this.toastrSrv.error('Falha ao buscar os dados. ' + err.error, 'Error');
        console.error('Error:', err);
      },
    });
  }
}