import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { ElevatorService } from 'src/app/services/elevator.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildingService } from 'src/app/services/building.service';
import { of } from 'rxjs';
import { CreateRoomComponent } from './create-room.component';
import { FloorService } from 'src/app/services/floor.service';
import { RoomService } from 'src/app/services/room.service';
import { By } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

describe('CreateRoomComponent', () => {
	let component: CreateRoomComponent;
	let fixture: ComponentFixture<CreateRoomComponent>;
	let de: DebugElement;

	let buildingService: BuildingService;
	let floorService: FloorService;
	let roomService: RoomService;
	let toastrService: ToastrService;

	let buildingsMockData = [
		{
			id: 'A',
			name: 'Building A',
			description: 'Description Building A',
			width: 10,
			depth: 8
		},
	];

	let floorsMockData = [
		{
			id: "A1",
			floorDescription: "asdfsadf",
			floorSize: {
				width: 10,
				depth: 8
			},
			building: "A"
		},
		{
			id: "A2",
			floorDescription: "asdfsadf",
			floorSize: {
				width: 10,
				depth: 8
			},
			building: "A"
		}
	];

	let roomMockData = {
		roomId: "A101",
		description: "sdgsdgs",
		size: {
			width: 2,
			depth: 2
		},
		position: {
			posX: 0,
			posY: 0
		},
		roomType: "Gabinete",
		floor: "A1"
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [CreateRoomComponent],
			imports: [
				HttpClientTestingModule,
				ToastrModule.forRoot(),
				ToastModule,
				FormsModule,
				ReactiveFormsModule
			],
			providers: [
				BuildingService,
				FloorService,
				RoomService,
				HttpRequestsService,
				MessageService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CreateRoomComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();

		buildingService = TestBed.inject(BuildingService);
		floorService = TestBed.inject(FloorService);
		roomService = TestBed.inject(RoomService);
		toastrService = TestBed.inject(ToastrService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load all buildings', () => {
		spyOn(buildingService, 'getBuildings').and.returnValue(of(buildingsMockData));

		component.loadBuildings();

		expect(component.buildingsList).toEqual(buildingsMockData);
	});

	it('should load all floors after selecting building', () => {
		spyOn(floorService, 'getFloorsByBuildingId').and.returnValue(of(floorsMockData));

		const buildingEl = de.query(By.css("#bId")).nativeElement;
		expect(buildingEl.getAttribute("formcontrolname")).toBe("buildingId");

		buildingEl.value = "A";
		buildingEl.dispatchEvent(new Event('change'));

		expect(component.floorsList).toEqual(floorsMockData);
	});

	it('should create a room if the data is valid', fakeAsync(() => {
		spyOn(component, 'prepareData').and.returnValue(roomMockData);
		spyOn(roomService, 'createRoom').and.returnValue(of(roomMockData));
		spyOn(toastrService, 'success');

		component.roomForm.setValue({
			buildingId: "A",
			roomId: roomMockData.roomId,
			description: roomMockData.description,
			width: roomMockData.size.width,
			depth: roomMockData.size.depth,
			posX: roomMockData.position.posX,
			posY: roomMockData.position.posY,
			roomType: roomMockData.roomType,
			floor: roomMockData.floor
		});

		component.prepareData();
		component.onSubmitForm();

		tick();

		expect(component.prepareData).toHaveBeenCalled();
		expect(roomService.createRoom).toHaveBeenCalled();
		expect(component.isFormValid).toBe(true);
		expect(toastrService.success).toHaveBeenCalled();
	}));
});
