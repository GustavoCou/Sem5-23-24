import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { FloorComponent } from './floor.component';
import { FloorService } from '../services/floor.service';
import { BuildingService } from '../services/building.service';
import { Floor } from '../dto/floor';
import Building from '../dto/building';

describe('FloorComponent', () => {
  let component: FloorComponent;
  let fixture: ComponentFixture<FloorComponent>;
  let floorService: FloorService;
  let buildingService: BuildingService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [FloorService, BuildingService, { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },],
    });

    fixture = TestBed.createComponent(FloorComponent);
    component = fixture.componentInstance;
    floorService = TestBed.inject(FloorService);
    buildingService = TestBed.inject(BuildingService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should load buildings on initialization', () => {
    const buildings = [{ id: '1', name: 'Building 1', description: 'Departamento de Saúde', width: 9, depth: 8}];
    spyOn(buildingService, 'getBuildings').and.returnValue(of(buildings));

    component.ngOnInit();

    expect(component.buildings).toEqual(buildings);
  });

  it('should handle error when loading buildings', () => {
    spyOn(buildingService, 'getBuildings').and.returnValue(throwError('Error loading buildings'));
    spyOn(console, 'error'); // to spy on console.error

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Erro ao carregar edifícios', 'Error loading buildings');
  });

  it('should create a floor', fakeAsync(() => {
    const buildingMock: Building = {
      id: '1',
      name: 'Building 1',
      description: 'Departamento de Saúde',
      width: 9,
      depth: 8
    };

    const floor: Floor = {
      id: '1',
      floorDescription: 'Test Floor',
      floorSize: { width: 5, depth: 5 },
      building: '1',
    };
  
    spyOn(floorService, 'getFloors').and.returnValue(of([])); // Mock getFloors to return an empty array initially
    spyOn(floorService, 'createFloor').and.returnValue(of(floor));
    spyOn(buildingService, 'getBuildings').and.returnValue(of([buildingMock])); // Mock getBuildings to return a building

    component.ngOnInit();
    tick();

    component.createFloor('1', 'Test Floor', { widthStr: '5', depthStr: '5' }, '1');
    tick();

    expect(component.floors.length).toBe(1);
    expect(toastrService.success).toHaveBeenCalledWith('Piso criado com sucesso!', 'Sucesso');
  }));
  

  it('should handle error when creating a floor', fakeAsync(() => {
    const buildingMock: Building = {
      id: '1',
      name: 'Building 1',
      description: 'Departamento de Saúde',
      width: 9,
      depth: 8
    };
  
    const errorResponse = 'Error creating floor';
  
    spyOn(floorService, 'getFloors').and.returnValue(of([]));
    spyOn(floorService, 'createFloor').and.returnValue(throwError(errorResponse)); // Throw an error
    spyOn(buildingService, 'getBuildings').and.returnValue(of([buildingMock]));
  
    component.ngOnInit();
    tick();
  
    component.createFloor('1', 'Test Floor', { widthStr: '5', depthStr: '5' }, '1');
    tick();
  
    expect(component.floors.length).toBe(0); // Ensure that the floors array is not modified on error
    expect(toastrService.error).toHaveBeenCalledWith(errorResponse, 'Erro');
  }));

  it('should update floor successfully', fakeAsync(() => {
    const buildingMock: Building = {
      id: '1',
      name: 'Building 1',
      description: 'Departamento de Saúde',
      width: 9,
      depth: 8
    };
  
    const floorToUpdate: Floor = {
      id: '1',
      floorDescription: 'Original Floor',
      floorSize: { width: 5, depth: 5 },
      building: '1',
    };
  
    const updatedFloor: Floor = {
      id: '1',
      floorDescription: 'Updated Floor',
      floorSize: { width: 8, depth: 8 },
      building: '1',
    };
  
    spyOn(floorService, 'getFloors').and.returnValue(of([floorToUpdate]));
    spyOn(floorService, 'updateFloor').and.returnValue(of(updatedFloor));
    spyOn(buildingService, 'getBuildings').and.returnValue(of([buildingMock]));
  
    component.ngOnInit();
    tick();
  
    component.updateFloor('1', 'Updated Floor', { widthStr: '8', depthStr: '8' }, '1');
    tick();
  
    expect(component.floors.length).toBe(1);
    expect(component.floors[0]).toEqual(updatedFloor);
    expect(toastrService.success).toHaveBeenCalledWith('Piso atualizado com sucesso!', 'Sucesso');
  }));

  it('should handle error when updating floor', fakeAsync(() => {
    const buildingMock: Building = {
      id: '1',
      name: 'Building 1',
      description: 'Departamento de Saúde',
      width: 9,
      depth: 8
    };
  
    const floorToUpdate: Floor = {
      id: '1',
      floorDescription: 'Original Floor',
      floorSize: { width: 5, depth: 5 },
      building: '1',
    };
  
    const errorResponse = 'Error updating floor';
  
    spyOn(floorService, 'getFloors').and.returnValue(of([floorToUpdate]));
    spyOn(floorService, 'updateFloor').and.returnValue(throwError(errorResponse));
    spyOn(buildingService, 'getBuildings').and.returnValue(of([buildingMock]));
  
    component.ngOnInit();
    tick();
  
    component.updateFloor('1', 'Updated Floor', { widthStr: '8', depthStr: '8' }, '1');
    tick();
  
    expect(component.floors.length).toBe(1); // Ensure that the floors array is not modified on error
    expect(toastrService.error).toHaveBeenCalledWith(errorResponse, 'Erro');
  }));
  
  

  afterEach(() => {
    fixture.destroy();
  });
});
