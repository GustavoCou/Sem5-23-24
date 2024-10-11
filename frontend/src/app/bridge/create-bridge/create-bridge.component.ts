import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import { Floor } from 'src/app/dto/floor';
import Building from 'src/app/dto/building';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-bridge',
  templateUrl: './create-bridge.component.html',
  styleUrls: ['./create-bridge.component.css'],
})
export class CreateBridgeComponent {
  bridgeForm: FormGroup;
  isFormValid = true;
  floorsX: Floor[] = [];
  floorsY: Floor[] = [];
  buildings: Building[] = [];

  constructor(private location: Location,
    private fb: FormBuilder,
    private http: HttpRequestsService,
    private spinner: NgxSpinnerService,
    private toastUserMessage: ToastrService,


  ) {
    this.bridgeForm = this.fb.group({

      bridgeId: ['', Validators.required],
      buildingIdX: ['', Validators.required],
      buildingIdY: ['', Validators.required],
      floorIdX: ['', Validators.required],
      floorIdY: ['', Validators.required],
      bridgeXPosX: ['', Validators.required],
      bridgeXPosY: ['', Validators.required],
      bridgeYPosX: ['', Validators.required],
      bridgeYPosY: ['', Validators.required],

    });

  }



  prepareData() {
    const formData = {
      bridgeId: this.bridgeForm.value.bridgeId,
      floorIdX: this.bridgeForm.value.floorIdX,
      floorIdY: this.bridgeForm.value.floorIdY,
      bridgePositionX: {
        posX: this.bridgeForm.value.bridgeXPosX,
        posY: this.bridgeForm.value.bridgeXPosY,
      },
      bridgePositionY: {
        posX: this.bridgeForm.value.bridgeYPosX,
        posY: this.bridgeForm.value.bridgeYPosY,
      },
    };

    return formData;
  }
  onSubmitForm() {
    if (this.bridgeForm.valid) {
      const formValue = this.prepareData();
      this.spinner.show();
      this.http.postRequest('bridge', formValue).subscribe({
        next: (data) => {
          this.toastUserMessage.success('Passagem Criada com sucesso', 'Successo');
          console.log('data fetched', data);
        },
        error: (err) => {
          if (err.status === 0) {
            //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
            this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
          } else {

            // this.toastUserMessage.error('Erro ao criar o passagem.\n' + JSON.stringify(err.error));
            // console.error('Erro completo:', err);


            let backendErrorMessage = err.error?.name;
            let errorMessage = 'Erro ao criar a passagem. ' + (backendErrorMessage || 'Bridge Id not allowed');
            this.toastUserMessage.error(errorMessage, 'Erro');
            console.error('Erro completo:', err);

          }
        },
      });
    } else {
      this.isFormValid = false;
    }
  }







  ngOnInit() {
    const buildingIdXControl = this.bridgeForm.get('buildingIdX');
    if (buildingIdXControl) {
      buildingIdXControl.valueChanges.subscribe(value => {
        this.getFloorsForBuilding(value, 'X');
      });
    }
    const buildingIdYControl = this.bridgeForm.get('buildingIdY');
    if (buildingIdYControl) {
      buildingIdYControl.valueChanges.subscribe(value => {
        this.getFloorsForBuilding(value, 'Y');
      });
    }
    this.getBuildings();
  }

  getBuildings() {
    this.http.getRequest('building/list').subscribe({
      next: (data) => {
        this.buildings = data;
        if (this.buildings.length <= 1) {
          // Mostra mensagem de erro se não houver edifícios suficientes
          this.toastUserMessage.info('Não existem edificios suficientes para criar uma passagem.');

        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar edificios com servidor a correr
          this.toastUserMessage.error('Erro ao carregar edifícios. Tente novamente mais tarde.', 'Erro');
          console.error('Erro:', err);
        }
      }
    });
  }

  getFloorsForBuilding(buildingId: string, buildingType: 'X' | 'Y') {
    if (!buildingId) {
      if (buildingType === 'X') this.floorsX = [];
      else this.floorsY = [];
      return;
    }

    this.spinner.show();
    this.http.getRequest(`floor/get/${buildingId}`).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (buildingType === 'X') {
          this.floorsX = data;
          if (this.floorsX.length === 0) {
            // Mostra mensagem se não houver pisos no Edifício A
            this.toastUserMessage.info('Nenhum Piso encontrado para o edificio selecionado');
          }
        } else {
          this.floorsY = data;
          if (this.floorsY.length === 0) {
            // Mostra mensagem se não houver pisos no Edifício B
            this.toastUserMessage.info('Nenhum Piso encontrado para o edificio selecionado');
          }
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar edificios com servidor a correr
          this.toastUserMessage.error('Erro ao carregar edifícios. Tente novamente mais tarde.', 'Erro');
          console.error('Erro:', err);
        }
      }
    });
  }




  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}