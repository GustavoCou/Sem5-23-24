import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Building from 'src/app/dto/building';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Floor } from 'src/app/dto/floor';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-elevator',
  templateUrl: './create-elevator.component.html',
  styleUrls: ['./create-elevator.component.css'],
})
export class CreateElevatorComponent {

  elevatorForm: FormGroup;
  isFormValid = true;
  floorIds: any = [];
  floors: Floor[] = [];

  buildings: Building[] = [];
  toastrSrv: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private http: HttpRequestsService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private toastUserMessage: ToastrService
  ) {
    this.elevatorForm = this.fb.group({
      elevatorId: ['', Validators.required],
      buildingId: ['', Validators.required],
      elevatorPosY: ['', Validators.required],
      elevatorPosX: ['', Validators.required],
      elevatorBrand: [''],
      elevatorModel: [''],
      elevatorSerialNumber: [''],
      elevatorDescription: [''],

    });

    this.onAddFloorId();
  }

  onSubmitForm() {
    this.isFormValid = true;
    const isValidFloorIds = this.validateFloorIds();

    // if (this.hasDuplicateFloorIds()) { ->validei no backend
    //   this.isFormValid = false;
    //   this.http.showTost('error', 'Erro', 'Pisos duplicados detectados. Por favor, selecione pisos diferentes.');
    //   return;
    // }

    if (this.elevatorForm.valid && !isValidFloorIds) {
      const formValue = this.prepareData();
      this.spinner.show();
      this.http.postRequest('elevator', formValue).subscribe({
        next: (data) => {
          this.spinner.hide();
          // this.http.showTost(
          //   'info',
          //   'Success',
          //   'Elevator Created Successfully'
          // );
          this.toastUserMessage.success('Elevador Criado com Sucesso', 'Successo');
          console.log('data fetched', data);
        },
        error: (err) => {
          this.spinner.hide();
          //this.http.showTost('error', 'Error', err.error);
          this.toastUserMessage.error('Erro ao criar o elevador.\n' + err.error, 'Erro');
          console.error('Erro:', err);

        },
      });
    } else {
      this.isFormValid = false;
    }
  }

  prepareData() {
    const idsArray = this.floorIds.map((item: any) => item?.id?.toString());
    const formData = {
      elevatorId: this.elevatorForm.value.elevatorId,
      buildingId: this.elevatorForm.value.buildingId,
      elevatorBrand: this.elevatorForm.value.elevatorBrand,
      elevatorModel: this.elevatorForm.value.elevatorModel,
      elevatorSerialNumber:
        this.elevatorForm.value.elevatorSerialNumber.toString(),
      elevatorDescription: this.elevatorForm.value.elevatorDescription,
      elevatorPosition: {
        posX: this.elevatorForm.value.elevatorPosX,
        posY: this.elevatorForm.value.elevatorPosY,
      },
      floorIds: idsArray,

    };
    //campos opcionais caso estejam vazios, remover ao solicitar o pedido pq nao sao precisos
    if (formData.elevatorBrand === null || formData.elevatorBrand === '') {
      delete formData.elevatorBrand;
    }
    if (formData.elevatorModel === null || formData.elevatorModel === '') {
      delete formData.elevatorModel;
    }

    if (formData.elevatorSerialNumber === null || formData.elevatorSerialNumber === '') {
      delete formData.elevatorSerialNumber;
    }
    if (formData.elevatorDescription === null || formData.elevatorDescription === '') {
      delete formData.elevatorDescription;
    }

    return formData;
  }
  onRemoveFloorId(index: any) {
    if (this.floorIds.length > 1) {
      this.floorIds.splice(index, 1);
    }
  }
  onAddFloorId() {
    const obj = {
      id: '',
    };
    this.floorIds.push(obj);
  }

  validateFloorIds() {
    const isValid = this.floorIds.some((item: any) => item.id == '');
    return isValid;
  }

  ngOnInit() {
    this.getBuildings();
  }

  getBuildings() {
    this.http.getRequest('building/list').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.buildings = data;
        } else {
          this.toastUserMessage.info('Nenhum Edificio encontrado. Não é possivel criar elevador');
          this.buildings = [];
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
  onBuildingChange() {
    const selectedBuildingId = this.elevatorForm.value.buildingId;
    this.http.getRequest(`floor/get/${selectedBuildingId}`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {

          this.floors = data;
        } else {
          // Nenhum piso encontrado, mostrar mensagem de erro
          //this.http.showTost('error', 'Nenhum Piso', 'O edifício selecionado não tem pisos.');
          this.toastUserMessage.info('O edifício selecionado não tem pisos.')
          this.floors = []; // Limpar os pisos existentes
        }
      }, error: (err) => {
        this.spinner.hide();
        this.toastUserMessage.error(err.error, 'Erro');
      }
    });
  }
  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }

  // hasDuplicateFloorIds(): boolean { --> implementei antes no backend
  //   const uniqueIds = new Set(this.floorIds.map((item: any) => item.id));
  //   return uniqueIds.size !== this.floorIds.length;
  // }


  backToMenu(): void {
    this.route.navigate(['/home']);
  }

}
