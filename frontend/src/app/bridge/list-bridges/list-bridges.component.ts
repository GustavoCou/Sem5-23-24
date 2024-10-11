import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Bridge from 'src/app/dto/bridge';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import Building from 'src/app/dto/building';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-list-bridges',
  templateUrl: './list-bridges.component.html',
  styleUrls: ['./list-bridges.component.css'],
})
export class ListBridgesComponent {
  constructor(
    private http: HttpRequestsService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private toastUserMessage: ToastrService,


  ) { }
  isFieldValid = true;
  buildingId1: string | null = null;
  buildingId2: string | null = null;
  listData: Bridge[] = [];
  bridges: any[] = [];
  buildings: Building[] = [];

  selectedBuildingId1: string | null = null;
  selectedBuildingId2: string | null = null;
  displayMessage = '';
  //isBtnDisabled = false;
  showInputFields = true;

  ngOnInit() {
    this.loadBuildings();
    this.loadBridges();
  }



  loadBuildings() {
    this.http.getRequest('building/list').subscribe(buildings => {
      this.buildings = buildings;
      if (this.buildings.length <= 1) {
        this.toastUserMessage.info("Edifícios insuficientes, apenas poderá consultar todas as pontes.");

      } else {
        // Reinicializa a mensagem e mostra os campos de entrada
        this.displayMessage = '';
        this.showInputFields = true;
        this.selectedBuildingId1 = '';
        this.selectedBuildingId2 = '';
      }
    });
  }




  loadBridges() {

    this.http.getRequest('bridge').subscribe(bridges => {
      if (bridges.length > 0) {
        this.bridges = bridges;
        console.log(this.bridges);
      } else {
        this.toastUserMessage.info('Nenhuma passagem encontrada.');

      }

    });

  }

  getAllBridges() {
    this.spinner.show();
    this.http.getRequest('bridge').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.spinner.hide();
          console.log('data fetched', data);
          this.listData = data;
        } else {
          this.toastUserMessage.info('Nenhuma passagem encontrada.');

        }

        if (this.listData.length > 0) {
          this.showInputFields = false; // Esconde os campos de entrada
        }
      },



      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {

          this.toastUserMessage.info('Não existem passagens criadas para listar');
          console.error('Erro:', err);
        }
      }
      ,
    });
  }

  getBridgesBetweenBuildings() {
    if (this.selectedBuildingId1 && this.selectedBuildingId2) {
      this.spinner.show();
      console.log(this.selectedBuildingId1);
      this.http
        .getRequest('bridge/' + this.selectedBuildingId1 + '/' + this.selectedBuildingId2)
        .subscribe({

          next: (data) => {
            this.spinner.hide();
            this.listData = data;
          },
          error: (err) => {
            this.toastUserMessage.info('Não há passagens entre os dois edificios selecionados');
            console.error('Erro:', err);
          },
        });
    } else {
      this.displayMessage = "Por favor, selecione ambos os edifícios.";
    }
  }

  onGetAllBridges() {
    this.buildingId1 = null;
    this.buildingId2 = null;
    this.isFieldValid = true;

    this.getAllBridges();
  }

  onSubmitForm() {
    this.listData = [];
    this.displayMessage = '';
    this.isFieldValid = true;
    this.buildingId1 = this.selectedBuildingId1;
    this.buildingId2 = this.selectedBuildingId2;
    if (
      this.buildingId1 !== null &&
      this.buildingId1 !== '' &&
      this.buildingId2 !== null &&
      this.buildingId2 !== ''
    ) {
      this.getBridgesBetweenBuildings();
    } else {
      this.isFieldValid = false;
      return;
    }
  }

  onChangeBuildingId() {
    this.buildingId1 = this.selectedBuildingId1;
    this.buildingId2 = this.selectedBuildingId2;
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}
