import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFloorsMapComponent } from './upload-floors-map.component';
import { BuildingService } from 'src/app/services/building.service';
import { FloorService } from '../../services/floor.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import Building from 'src/app/dto/building';
import { Floor } from 'src/app/dto/floor';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';


describe('UploadFloorsMapComponent', () => {
  let component: UploadFloorsMapComponent;
  let fixture: ComponentFixture<UploadFloorsMapComponent>;
  let floorService: FloorService;
  let buildingService: BuildingService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFloorsMapComponent],
      imports: [HttpClientTestingModule, RouterTestingModule,ToastrModule.forRoot(),FormsModule],
      providers: [FloorService, BuildingService,
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['error']) }],
    });

    fixture = TestBed.createComponent(UploadFloorsMapComponent);
    component = fixture.componentInstance;
    floorService = TestBed.inject(FloorService);
    buildingService = TestBed.inject(BuildingService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
 
  });
   

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load buildings on initialization', () => {
    const mockBuildings: Building[] = [{ id: '1', name: 'Building 1',description :'Test',width:2,depth:3 }];
    spyOn(buildingService, 'getBuildings').and.returnValue(of(mockBuildings));

    fixture.detectChanges();

    expect(component.buildings).toEqual(mockBuildings);
  });

  it('should load floors when building is selected', () => {
    const selectedBuildingId = 1;
    const mockFloors: Floor[] = [{ id: '2', floorDescription: 'Floor 1',floorSize : {width:2,depth:3},building: '1' }];
    spyOn(floorService, 'getFloorsByBuildingId').and.returnValue(of(mockFloors));

    component.selectedBuildingId = selectedBuildingId;
    component.loadFloors();

    expect(component.floors).toEqual(mockFloors);
  });
/*
  it('should handle error when loading buildings', () => {
    const errorMessage = 'Error fetching buildings';
    spyOn(buildingService, 'getBuildings').and.returnValue(throwError({ error: errorMessage }));
  
    component.loadBuildings();
  
    expect(toastrService.error).toHaveBeenCalledWith(`Erro ao carregar edifícios ${errorMessage}`, 'Error');
    console.error('Error:', errorMessage);
  });
  
  it('should handle error when loading floors', () => {
    const selectedBuildingId = 1;
    const errorMessage = 'Error fetching floors';
    spyOn(floorService, 'getFloorsByBuildingId').and.returnValue(throwError({ error: errorMessage }));
  
    component.selectedBuildingId = selectedBuildingId;
    component.loadFloors();
  
    expect(toastrService.error).toHaveBeenCalledWith(`Erro ao carregar pisos ${errorMessage}`, 'Error');
    console.error('Error:', errorMessage);
  });

  */
});