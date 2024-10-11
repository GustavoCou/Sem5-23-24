import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Building from 'src/app/dto/building';
import { Floor } from 'src/app/dto/floor';
import { BuildingService } from 'src/app/services/building.service';
import { FloorService } from 'src/app/services/floor.service';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-building-min-max-floor',
  templateUrl: './list-building-min-max-floor.component.html',
  styleUrls: ['./list-building-min-max-floor.component.css']
})
export class ListBuildingMinMaxFloorComponent {
  minFloors: number = 0;
  maxFloors: number = 0;
  floors: any[] = [];
  showForm = true;

  constructor(private location: Location, private floorService: FloorService, private toastrSrv: ToastrService) { }

  ngOnInit() {
  }

  backToMenu(){
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

  getBuildingsInFloorRange(): void {
    if (this.minFloors < 0 || this.maxFloors < 0) {
      this.toastrSrv.warning('Os valores mínimo e máximo não podem ser negativos.', 'Warning');
      return;
    }
  
    this.floorService.getBuildingsInFloorRange(this.minFloors, this.maxFloors)
      .subscribe({
        next: (data: any) => {
          if (data && data.isSuccess && data._value && data._value.length > 0) {
            this.floors = data._value.sort((a: any, b: any) => a.totalFloors - b.totalFloors);
          } else {
            this.toastrSrv.warning('Nenhum dado disponível!', 'Warning');
          }
        },
        error: (err) => {
          this.toastrSrv.error('Falha ao buscar os dados.' + err.error, 'Error');
          console.error('Error:', err);
        },
      });
  }
}
