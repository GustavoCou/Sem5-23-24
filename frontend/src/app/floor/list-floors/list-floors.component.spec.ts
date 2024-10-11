import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { FloorService } from '../../services/floor.service';
import { BuildingService } from '../../services/building.service';
import { Floor } from '../../dto/floor';
import Building from '../../dto/building';
import { ListFloorsComponent } from './list-floors.component';

describe('ListFloorsComponent', () => {
  let component: ListFloorsComponent;
  let fixture: ComponentFixture<ListFloorsComponent>;
  let floorService: FloorService;
  let buildingService: BuildingService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFloorsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule,ToastrModule.forRoot()],
      providers: [FloorService, BuildingService,
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['error']) }, ],
    });

    fixture = TestBed.createComponent(ListFloorsComponent);
    component = fixture.componentInstance;
    floorService = TestBed.inject(FloorService);
    buildingService = TestBed.inject(BuildingService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
  it('should fetch floor list', () => {
    const selectedBuildingId = '1';
    floorService.createFloor({ id: '1', floorDescription: 'Floor 1', floorSize: { width: 10, depth: 20 }, building:"1" }as Floor)
    const mockFloors:Floor[] = []
    spyOn(floorService, 'getFloorsByBuildingId').and.returnValue(of(mockFloors));
  
    component.selectedBuildingId = selectedBuildingId;
    component.fetchFloorList();

    expect(component.floorList.length).toEqual(mockFloors.length);
  });

  it('should handle error when fetching floor list', () => {
    const selectedBuildingId = '1';
    const errorMessage = 'Error fetching floors';
  
    spyOn(floorService, 'getFloorsByBuildingId').and.returnValue(throwError({ error: errorMessage }));
  
    component.selectedBuildingId = selectedBuildingId;
    component.fetchFloorList();
  
    expect(toastrService.error).toHaveBeenCalledWith(`Falha em Listar os pisos.\n${errorMessage}`, 'Error');
  });
  

});
