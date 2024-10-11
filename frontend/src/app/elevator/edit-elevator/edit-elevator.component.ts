import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Building from 'src/app/dto/building';
import { Elevator } from 'src/app/dto/elevator';
import { BuildingService } from 'src/app/services/building.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { Location } from '@angular/common';
import translate from 'translate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-edit-elevator',
	templateUrl: './edit-elevator.component.html',
	styleUrls: ['./edit-elevator.component.css']
})
export class EditElevatorComponent {
  	elevatorList: Elevator[] = [];
	buildingList: Building[] = [];
	selectedBuildingId: any;
	selectedElevatorId: any;

	elevatorForm: FormGroup;
	isFormValid = true;

	constructor(
		private location: Location,
		private elevatorService: ElevatorService,
		private toastrSrv: ToastrService,
		private buildingService: BuildingService,
		private fb: FormBuilder
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
			floorIds: [''],
			uniqueCodBuilding: [0]
		});
	}

	ngOnInit () {
		this.loadBuildings();
	}

	loadBuildings() {
		this.buildingService.getBuildings().subscribe(
			building => {
				this.buildingList = building;
			},
			error => {
				console.error('Erro ao carregar edifícios', error);
			}
		);
	}

	fetchElevatorList() {
		this.elevatorList.splice(0, this.elevatorList.length); // Limpar array da listagem de elevadores

		this.elevatorService.getElevatorsByBuildingId(this.selectedBuildingId).subscribe(
			{
				next: (data: Elevator[]) => {
					for (let i = 0; i < data.length; i++) {
						console.log('data fetched', data[i]);
						this.elevatorList.push(data[i]);
					}
				},
				error: async (err) => {
					let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });

					this.toastrSrv.error('Falha ao listar os pisos.<br/>' + errorPT, 'Erro', { enableHtml: true });
					console.error('Error: ', err);
				},
			}
		);
	}

	goBack() {
		this.location.replaceState(this.location.path());
		window.location.reload();
	}

	onSubmitForm () {
		console.log("Endpoint unavailable.");
		let elevatorDTO = this.prepareData();

		this.elevatorService.editElevator(elevatorDTO).subscribe(
			{
				next: (data: Elevator) => {
						console.log('data fetched', data);
				},
				error: async (err) => {
					let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });

					this.toastrSrv.error('Falha ao atualizar elevador.<br/>' + errorPT, 'Erro', { enableHtml: true });
					console.error('Error: ', err);
				},
			}
		);
	}

	prepareData() {
		const formData = {
			floorIds: this.elevatorForm.value.floorIds,
			elevatorUniqueCodBuilding: this.elevatorForm.value.uniqueCodBuilding,
			elevatorId: this.elevatorForm.value.elevatorId,
			elevatorPosition: {
				posX: this.elevatorForm.value.elevatorPosX,
				posY: this.elevatorForm.value.elevatorPosY
			},
			buildingId: this.elevatorForm.value.buildingId,
			elevatorBrand: this.elevatorForm.value.elevatorBrand,
			elevatorModel: this.elevatorForm.value.elevatorModel,
			elevatorSerialNumber: this.elevatorForm.value.elevatorSerialNumber,
			elevatorDescription: this.elevatorForm.value.elevatorDescription
		};

		return formData;
	}

	loadElevatorInfo () {
		let elevator = this.elevatorList.find(el => el.elevatorId === this.selectedElevatorId);

		this.elevatorForm.setValue({
			elevatorId: elevator?.elevatorId,
			buildingId: elevator?.buildingId,
			elevatorPosY: elevator?.elevatorPosition.posX,
			elevatorPosX: elevator?.elevatorPosition.posY,
			elevatorBrand: elevator?.elevatorBrand,
			elevatorModel: elevator?.elevatorModel,
			elevatorSerialNumber: elevator?.elevatorSerialNumber,
			elevatorDescription: elevator?.elevatorDescription,
			floorIds: elevator?.floorIds,
			uniqueCodBuilding: elevator?.elevatorUniqueCodBuilding
		});
	}
}
