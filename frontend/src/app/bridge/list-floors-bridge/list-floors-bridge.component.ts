import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import BridgeFloorInfo from 'src/app/dto/bridgeFloorInfo';
import Building from 'src/app/dto/building';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import { Floor } from 'src/app/dto/floor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-floors-bridge',
  templateUrl: './list-floors-bridge.component.html',
  styleUrls: ['./list-floors-bridge.component.css'],
})
export class ListFloorsBridgeComponent implements OnInit {
  constructor(
    private http: HttpRequestsService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private toastUserMessage: ToastrService,

  ) { }
  isFieldValid = true;
  buildingId = '';
  buildingId1: string | null = null;
  listData: BridgeFloorInfo[] = [];
  buildings: Building[] = [];
  floors: Floor[] = [];
  displayMessage = '';
  noBuildingsMessage = '';

  ngOnInit() {
    this.loadBuildings();
    this.loadFloors();
  }

  loadBuildings() {
    this.spinner.show();
    this.http.getRequest('building/list').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.spinner.hide();
          console.log('data fetched', data);
          this.buildings = data;
        } else {
          this.toastUserMessage.info('Nao existem edificios para escolher');

        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {

          this.toastUserMessage.info('Nao existem edificios para escolher');
          console.error('Erro:', err);
        }
      }
      ,
    });
  }


  loadFloors() {
    this.http.getRequest('floor/get').subscribe(floors => {
      this.floors = floors;
      console.log(floors);
      if (this.floors.length === 0) {
        this.toastUserMessage.info("Não existem pisos disponiveis");
      }
    });
  }

  getFloorsOfBuilding() {
    this.spinner.show();
    this.http.getRequest('bridge/' + this.buildingId).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.listData = data.bridgeInformationDTO as BridgeFloorInfo[];

      },
      error: (err) => {
        this.toastUserMessage.info('Não existem pisos neste edificio com passagens');
        //console.error('Erro:', err);
      },
    });
  }





  onSubmitForm() {
    this.listData = [];

    this.isFieldValid = true;
    if (this.buildingId !== null && this.buildingId !== '') {

      this.getFloorsOfBuilding();
    } else {
      this.isFieldValid = false;
      return;
    }
  }

  onChangeBuildingId() {
    this.buildingId1 = this.buildingId;
  }


  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

}
