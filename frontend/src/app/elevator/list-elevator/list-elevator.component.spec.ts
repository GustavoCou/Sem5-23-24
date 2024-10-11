import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListElevatorComponent } from './list-elevator.component';
import { DebugElement } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { FormsModule } from '@angular/forms';
import { BuildingService } from 'src/app/services/building.service';
import { of } from 'rxjs';

describe('ListElevatorComponent', () => {
  	let component: ListElevatorComponent;
  	let fixture: ComponentFixture<ListElevatorComponent>;
	let de: DebugElement;

	let buildingService: BuildingService;
	let elevatorService: ElevatorService;

	let buildingsMockData = [
		{
			id: 'A',
			name: 'Building A',
			description: 'Description Building A',
			width: 10,
			depth: 8
		},
	];

	let elevatorMockData = [
		{
			floorIds: ["A1", "A2"],
			elevatorUniqueCodBuilding: 1,
			elevatorId: "EL_A",
			elevatorPosition: {
				posX: 0,
				posY: 3
			},
			buildingId: "A",
			elevatorBrand: "Brand A",
			elevatorModel: "Model A",
			elevatorSerialNumber: "12345",
			elevatorDescription: "Description Elevator A"
		},
		{
			floorIds: ["A2"],
			elevatorUniqueCodBuilding: 2,
			elevatorId: "EL_B",
			elevatorPosition: {
				posX: 10,
				posY: 3
			},
			buildingId: "A",
			elevatorBrand: "Brand A",
			elevatorModel: "Model A",
			elevatorSerialNumber: "123456",
			elevatorDescription: "Description Elevator B"
		}
	]

  	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ListElevatorComponent],
			imports: [
				HttpClientTestingModule,
				ToastrModule.forRoot(),
				FormsModule],
			providers: [
				BuildingService,
				ElevatorService,
				HttpRequestsService
			]
		}).compileComponents();
    
		fixture = TestBed.createComponent(ListElevatorComponent);
    	component = fixture.componentInstance;
		de = fixture.debugElement;
    	fixture.detectChanges();

		buildingService = TestBed.inject(BuildingService);
		elevatorService = TestBed.inject(ElevatorService);
  	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load all buildings', () => {
		spyOn(buildingService, 'getBuildings').and.returnValue(of(buildingsMockData));

		component.loadBuildings();

		expect(component.buildingList).toEqual(buildingsMockData);
	});

	it('should fetch building elevators', () => {
		spyOn(elevatorService, 'getElevatorsByBuildingId').and.returnValue(of(elevatorMockData));

		component.selectedBuildingId = "A";
		component.fetchElevatorList();

		expect(component.elevatorList).toEqual(elevatorMockData);
	});
});
