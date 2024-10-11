import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BuildingService } from 'src/app/services/building.service';
import { Location } from '@angular/common';
import Building from 'src/app/dto/building';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { RoomService } from 'src/app/services/room.service';
import { Floor } from 'src/app/dto/floor';
import { FloorService } from 'src/app/services/floor.service';
import translate from "translate";

@Component({
	selector: 'app-create-room',
	templateUrl: './create-room.component.html',
	styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

	roomForm: FormGroup;

	buildingsList: Building[] = [];
	floorsList: Floor[] = [];

	isFormValid = true;

	constructor(
		private location: Location,
		private buildingService: BuildingService,
		private floorService: FloorService,
		private roomService: RoomService,
		private toastrSrv: ToastrService,
		private fb: FormBuilder
	) {
		this.roomForm = this.fb.group({
			buildingId: [""],
			roomId: ["", Validators.required],
			description: ["", Validators.required],
			width: [0, Validators.required],
			depth: [0, Validators.required],
			posX: [0, Validators.required],
			posY: [0, Validators.required],
			roomType: ["", Validators.required],
			floor: ["", Validators.required]
		});
	}

	onSubmitForm() {
		this.isFormValid = true;

		if (this.roomForm.valid) {
			const formValue = this.prepareData();

			this.roomService.createRoom(formValue).subscribe({
				next: (data) => {
					this.toastrSrv.success("Sala criada com sucesso", "Sucesso");
				},
				error: async (err) => {
					let errorPT = await translate(err, { to: "pt", engine: "deepl", key: "cc66253f-6378-08b8-d4f9-7b88f01e7adc:fx" });
					this.toastrSrv.error("Criação de sala falhou.</br>" + errorPT, "Erro", { enableHtml: true });
				},
			});
		}
		else {
			this.isFormValid = false;
		}
	}

	prepareData() {
		const formData = {
			roomId: this.roomForm.value.roomId,
			description: this.roomForm.value.description,
			size: {
				width: this.roomForm.value.width,
				depth: this.roomForm.value.depth
			},
			position: {
				posX: this.roomForm.value.posX,
				posY: this.roomForm.value.posY
			},
			roomType: this.roomForm.value.roomType,
			floor: this.roomForm.value.floor
		};

		return formData;
	}

	ngOnInit() {
		this.loadBuildings();
	}

	loadBuildings() {
		this.buildingService.getBuildings().subscribe(
			buildings => {
				this.buildingsList = buildings;
			},
			error => {
				this.toastrSrv.error('Erro ao carregar edifícios', 'Erro');
				console.error('Erro ao carregar edifícios', error);
			}
		);
	}

	onBuildingChange() {
		this.floorService.getFloorsByBuildingId(this.roomForm.value.buildingId).subscribe({
			next: (data) => {
				if (data && data.length > 0) {
					this.floorsList = data;
				}
				else {
					// Nenhum piso encontrado, mostrar mensagem de erro
					this.toastrSrv.error("O edifício " + this.roomForm.value.buildingId + " não tem pisos criados.", "Pisos indisponíveis");
					this.floorsList = [];
				}
			},
			error: (err) => {
				this.toastrSrv.error("Ocorreu um erro ao procurar pisos.\n" + err.error, "Erro");
			}
		});
	}

	backToMenu() {
		this.location.replaceState(this.location.path());
		window.location.reload();
	}

	goBack() {
		this.location.replaceState(this.location.path());
		window.location.reload();
	}

}
