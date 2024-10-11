import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Building from 'src/app/dto/building';
import { Elevator } from 'src/app/dto/elevator';
import { BuildingService } from 'src/app/services/building.service';
import { ElevatorService } from 'src/app/services/elevator.service';
import { Location } from '@angular/common';
import translate from 'translate';

@Component({
	selector: 'app-list-elevator',
	templateUrl: './list-elevator.component.html',
	styleUrls: ['./list-elevator.component.css']
})
export class ListElevatorComponent {

	elevatorList: Elevator[] = [];
	buildingList: Building[] = [];
	selectedBuildingId: any;

	constructor(
		private location: Location,
		private elevatorService: ElevatorService,
		private toastrSrv: ToastrService,
		private buildingService: BuildingService
	) {
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
}
