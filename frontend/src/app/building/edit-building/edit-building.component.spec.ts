import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EditBuildingComponent } from '../edit-building/edit-building.component';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastModule } from 'primeng/toast';  
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

interface FormData {
  id: string;
  name?: string;
  description?: string;
  width?: number;
  depth?: number;
}

describe('EditBuildingComponent', () => {
  let component: EditBuildingComponent;
  let fixture: ComponentFixture<EditBuildingComponent>;
  let location: Location;
  let toastrService: ToastrService;
  let httpRequestsService: HttpRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBuildingComponent],
      imports: [ReactiveFormsModule, FormsModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [
        Location,
        FormBuilder,
        HttpRequestsService,
        MessageService,
      ],
    });

    fixture = TestBed.createComponent(EditBuildingComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    toastrService =  TestBed.inject(ToastrService) ;
    httpRequestsService = TestBed.inject(HttpRequestsService);
  });
  
  it('should create EditBuildingComponent', () => {
       expect(component).toBeTruthy();
  });
  it('should initialize formBuilding and set default values', () => {
    expect(component.formBuilding).toBeDefined();
    expect(component.isNameDisabled).toBe(true);
    expect(component.isDescriptionDisabled).toBe(true);
    expect(component.isWidthDisabled).toBe(true);
    expect(component.isDepthDisabled).toBe(true);
    expect(component.checksDisabled).toBe(false);
  });

  it('should initialize formBuilding', () => {
    expect(component.formBuilding).toBeDefined();
  });
  
 
  
  it('should prepare data with complete form data', () => {
    component.formBuilding.setValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });

    component.isNameDisabled = false;
    component.isDescriptionDisabled = false;
    component.isWidthDisabled = false;
    component.isDepthDisabled = false;

    const preparedData: FormData = component.prepareData();

    expect(preparedData).toEqual({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
  });


  it('should toggle readonly for name field', () => {
    component.toggleReadonly('name');
    expect(component.isNameDisabled).toBe(false);

    expect(component.isDepthDisabled).toBe(true);
    expect(component.isWidthDisabled).toBe(true);
    expect(component.isDescriptionDisabled).toBe(true);
  
  });

  it('should set readonly status for all fields', () => {
    component.readonlyAll();
    expect(component.isNameDisabled).toBe(true);
    expect(component.isDescriptionDisabled).toBe(true);
    expect(component.isWidthDisabled).toBe(true);
    expect(component.isDepthDisabled).toBe(true);
  });

  it('should submit form and update building successfully', fakeAsync(() => {
    

    component.formBuilding.setValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
    
    spyOn(component, 'prepareData').and.returnValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
    
    spyOn(httpRequestsService, 'putRequest').and.returnValue(of({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    }));

    spyOn(component, 'readonlyAll');
    spyOn(toastrService, 'success');

    component.onSubmitForm();
    
    tick();

    expect(component.prepareData).toHaveBeenCalled();
    expect(httpRequestsService.putRequest).toHaveBeenCalledWith('building/edit/', {
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
    expect(component.checksDisabled).toBe(true);
    expect(component.readonlyAll).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Building Update successfully', 'Success');
  }));


});
