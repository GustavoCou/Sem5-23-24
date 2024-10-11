import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Floor } from '../../dto/floor';
import { FloorService } from '../../services/floor.service';
import { BuildingService } from 'src/app/services/building.service';
import Building from 'src/app/dto/building';
@Component({
  selector: 'app-list-floors',
  templateUrl: './list-floors.component.html',
  styleUrls: ['./list-floors.component.css']
})
export class ListFloorsComponent {
  
  floorList: Floor[]= [];
  buildingsList: Building[]=[];
  selectedBuildingId: any;
  constructor(private location: Location,  
              private floorService: FloorService,
              private toastrSrv: ToastrService,
              private buildingService: BuildingService, 
    ){
      this.loadBuildings()
  }

goBack(){
  this.location.replaceState(this.location.path());
  window.location.reload();
}



loadBuildings() {


  this.buildingService.getBuildings()
  .subscribe(buildings => {
      this.buildingsList = buildings;
    },
    error => {
    
      this.toastrSrv.error('Erro ao carregar edifícios', 'Error');
      
    });
}

fetchFloorList() {
  this.floorList.splice(0, this.floorList.length);
  this.floorService.getFloorsByBuildingId(this.selectedBuildingId).subscribe({
    next: (data : any[]) => {
     
    this.floorList.push(...data);
          console.log('data fetched', data);
    },
    error: (err) => {

      this.toastrSrv.error('Falha em Listar os pisos.\n'+ err.error, 'Error');
      console.error('Error:', err);

    },
});
}
}
