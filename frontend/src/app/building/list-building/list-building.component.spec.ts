import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListBuildingComponent } from './list-building.component';
import { Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
 

describe('ListBuildingComponent', () => {
  let component: ListBuildingComponent;
  let fixture: ComponentFixture<ListBuildingComponent>;
  let location: Location;
  let toastrService: ToastrService;
  let httpRequestsService: HttpRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBuildingComponent],
      imports: [ReactiveFormsModule, FormsModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [
        Location,
        FormBuilder,
        HttpRequestsService,
        MessageService,
      ],
    });

    fixture = TestBed.createComponent(ListBuildingComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    toastrService =  TestBed.inject(ToastrService) ;
    httpRequestsService = TestBed.inject(HttpRequestsService);

 });

  it('should create ListBuildingComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch building list successfully', fakeAsync(() => {
    const mockBuildingList:any = [];

    spyOn(httpRequestsService, 'getRequest').and.returnValue(of(mockBuildingList));

    component.fetchBuildingList();

    
    
    tick();

    expect(httpRequestsService.getRequest).toHaveBeenCalledWith('building/list/');
    expect(component.buildingList).toEqual(mockBuildingList);
  }));

  it('should handle error while fetching building list', fakeAsync(() => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };
    spyOn(httpRequestsService, 'getRequest').and.returnValue(of({ error: mockError }));

    spyOn(toastrService, 'error');

    component.fetchBuildingList();

    // Ejecuta las tareas en la cola de tareas falsas
    tick();

    expect(httpRequestsService.getRequest).toHaveBeenCalledWith('building/list/');
   // expect(toastrService.error).toHaveBeenCalledWith(`Failed to List building.\n${mockError.error}`, 'Error');
  }));

  it('should go back', () => {
    spyOn(location, 'replaceState');
    spyOn(httpRequestsService, 'reload');

    component.goBack();

    expect(location.replaceState).toHaveBeenCalled();
    expect(httpRequestsService.reload).toHaveBeenCalled();
  });
});
