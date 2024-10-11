import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListBuildingMinMaxFloorComponent } from './list-building-min-max-floor.component';
import { Location } from '@angular/common';
import { FloorService } from 'src/app/services/floor.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('ListBuildingMinMaxFloorComponent', () => {
  let component: ListBuildingMinMaxFloorComponent;
  let fixture: ComponentFixture<ListBuildingMinMaxFloorComponent>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(() => {
    const floorService = jasmine.createSpyObj('FloorService', ['getBuildingsInFloorRange']);
    const toastrService = jasmine.createSpyObj('ToastrService', ['warning', 'error']);
    const location = jasmine.createSpyObj('Location', ['replaceState', 'path']);

    TestBed.configureTestingModule({
      declarations: [ListBuildingMinMaxFloorComponent],
      providers: [
        { provide: FloorService, useValue: floorService },
        { provide: ToastrService, useValue: toastrService },
        { provide: Location, useValue: location },
      ],
    });

    fixture = TestBed.createComponent(ListBuildingMinMaxFloorComponent);
    component = fixture.componentInstance;
    floorServiceSpy = TestBed.inject(FloorService) as jasmine.SpyObj<FloorService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    locationSpy.path.and.returnValue('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getBuildingsInFloorRange', () => {
    it('should show warning and not call service if minFloors or maxFloors is negative', () => {
      component.minFloors = -1;
      component.maxFloors = 2;

      component.getBuildingsInFloorRange();

      expect(toastrServiceSpy.warning).toHaveBeenCalledWith('Os valores mínimo e máximo não podem ser negativos.', 'Warning');
      expect(floorServiceSpy.getBuildingsInFloorRange).not.toHaveBeenCalled();
    });

    it('should call service and update floors on success', fakeAsync(() => {
      const mockData = { isSuccess: true, isFailure: false, error: null, _value: [
        { buildingId: 'A', floorId: ['Floor A1', 'Floor A2', 'Floor A3'], totalFloors: 3 },
        { buildingId: 'B', floorId: ['Floor B1', 'Floor B2', 'Floor B3', 'Floor B4', 'Floor B5'], totalFloors: 5 },
      ]};
      floorServiceSpy.getBuildingsInFloorRange.and.returnValue(of(mockData as any));

      component.minFloors = 1;
      component.maxFloors = 5;
      component.getBuildingsInFloorRange();
      tick();

      expect(floorServiceSpy.getBuildingsInFloorRange).toHaveBeenCalledWith(1, 5);
      expect(component.floors).toEqual(mockData._value as any);
    }));

    it('should show warning on empty data', fakeAsync(() => {
      const mockData = { isSuccess: true, isFailure: false, error: null, _value: [] };
      floorServiceSpy.getBuildingsInFloorRange.and.returnValue(of(mockData as any));

      component.minFloors = 1;
      component.maxFloors = 5;
      component.getBuildingsInFloorRange();
      tick();

      expect(toastrServiceSpy.warning).toHaveBeenCalledWith('Nenhum dado disponível!', 'Warning');
      expect(component.floors).toEqual([]);
    }));      
  });
});
