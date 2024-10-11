import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { Location } from '@angular/common';
import Bridge from 'src/app/dto/bridge';
import Building from 'src/app/dto/building';
import { Floor } from 'src/app/dto/floor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-bridge',
  templateUrl: './edit-bridge.component.html',
  styleUrls: ['./edit-bridge.component.css']
})
export class EditBridgeComponent {
  bridgeForm: FormGroup;
  isFormValid = true;
  floorsX: Floor[] = [];
  floorsY: Floor[] = [];
  buildings: Building[] = [];
  bridge: Bridge[] = [];


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
      console.log(formValue);
      const bridgeId = formValue.bridgeId;
      delete formValue.bridgeId;
      this.spinner.show();
      this.http.putRequest('bridge/' + bridgeId, formValue).subscribe({
        next: (data) => {
          this.toastUserMessage.success('Passagem Editada com sucesso', 'Successo');
          console.log('data fetched', data);
        },
        error: (err) => {
          if (err.status === 0) {
            //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
            this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
          } else {

            //  this.toastUserMessage.error('Erro ao editar o passagem.\n' + JSON.stringify(err.error));

            let backendErrorMessage = err.error.error?.name;
            let errorMessage = 'Erro ao editar a passagem. ' + (backendErrorMessage);
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
    this.getBuildings();
    this.getBridge();
    this.setupFormChanges();
  }

  setupFormChanges() {
    this.bridgeForm.get('buildingIdX')?.valueChanges.subscribe(buildingId => {
      this.getFloorsForBuilding(buildingId, 'X');
    });

    this.bridgeForm.get('buildingIdY')?.valueChanges.subscribe(buildingId => {
      this.getFloorsForBuilding(buildingId, 'Y');
    });
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



  getBridge() {
    this.http.getRequest('bridge').subscribe({
      next: (data) => {
        this.bridge = data;
        if (this.bridge.length === 0) {
          // Mostra mensagem de erro se não houver pontes 
          this.toastUserMessage.info('Não existem passagens disponiveis para editar');

        }
      },
      error: (err) => {
        this.spinner.hide();
        if (err.status === 0) {
          //erro de conexao .pex server n esta a correr por isso nem consigo ir buscar  os ed
          this.toastUserMessage.error('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        } else {
          //erro ao carregar edificios com servidor a correr
          this.toastUserMessage.info('Não existem passagens disponiveis');
        }
      }
    });
  }

  onBridgeSelected(bridgeId: string) {
    const selectedBridge = this.bridge.find(b => b.bridgeId === bridgeId);
    if (selectedBridge) {
      this.fillFormWithBridgeData(selectedBridge);
      this.getFloorsForBuilding(selectedBridge.buildingX, 'X', selectedBridge.floorIdX);
      this.getFloorsForBuilding(selectedBridge.buildingY, 'Y', selectedBridge.floorIdY);
    }
  }


  fillFormWithBridgeData(bridgeData: Bridge) {
    this.bridgeForm.patchValue({
      bridgeId: bridgeData.bridgeId,
      buildingIdX: bridgeData.buildingX,
      buildingIdY: bridgeData.buildingY,
      floorIdX: bridgeData.floorIdX,
      floorIdY: bridgeData.floorIdY,
      bridgeXPosX: bridgeData.bridgePositionX?.posX,
      bridgeXPosY: bridgeData.bridgePositionX?.posY,
      bridgeYPosX: bridgeData.bridgePositionY?.posX,
      bridgeYPosY: bridgeData.bridgePositionY?.posY,
    }, { emitEvent: false });
  }


  getFloorsForBuilding(buildingId: string, buildingType: 'X' | 'Y', selectedFloorId?: string) {
    if (!buildingId) {
      this.updateFloorsAndForm([], buildingType, selectedFloorId);
      return;
    }


    this.spinner.show();
    this.http.getRequest(`floor/get/${buildingId}`).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.updateFloorsAndForm(data, buildingType, selectedFloorId);
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

        this.toastUserMessage.info('Encontrado edificio sem piso', 'Erro');
        console.error('Erro:', err);
      }
    });
  }

  updateFloorsAndForm(floors: Floor[], buildingType: 'X' | 'Y', selectedFloorId?: string) {
    if (buildingType === 'X') {
      this.floorsX = floors;
      const floorControlX = this.bridgeForm.get('floorIdX');
      if (floorControlX) {
        floorControlX.setValue(selectedFloorId || '', { emitEvent: false });
      }
    } else {
      this.floorsY = floors;
      const floorControlY = this.bridgeForm.get('floorIdY');
      if (floorControlY) {
        floorControlY.setValue(selectedFloorId || '', { emitEvent: false });
      }
    }
  }


  private resetFormControl(controlName: string): void {
    const control = this.bridgeForm.get(controlName);
    if (control) {
      control.setValue('');
    }
  }



  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }


}



