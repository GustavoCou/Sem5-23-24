import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CreateBuildingComponent } from './create-building.component';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastModule } from 'primeng/toast';  
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';


describe('CreateBuildingComponent', () => {
  let component: CreateBuildingComponent;
  let fixture: ComponentFixture<CreateBuildingComponent>;
  let location: Location;
  let toastrService: ToastrService;
  let httpRequestsService: HttpRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBuildingComponent],
      imports: [ReactiveFormsModule, FormsModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [
        Location,
        FormBuilder,
        HttpRequestsService,
        MessageService,
      ],
    });

    fixture = TestBed.createComponent(CreateBuildingComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    toastrService =  TestBed.inject(ToastrService) ;
    httpRequestsService = TestBed.inject(HttpRequestsService);
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize formBuilding', () => {
    expect(component.formBuilding).toBeDefined();
   
  });
  
  it('should go back', () => {
    spyOn(location, 'replaceState');
    spyOn(httpRequestsService, 'reload');
  
    try {
      component.goBack();
  
      expect(location.replaceState).toHaveBeenCalled();
      expect(httpRequestsService.reload).toHaveBeenCalled();
    } catch (error) {
      console.error('Error in goBack test:', error);
      fail(error);
    }
  });
  
  it('should prepare data', () => {
    // Simula valores en el formulario
    component.formBuilding.setValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
  
    const preparedData = component.prepareData();
  
    expect(preparedData).toEqual({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
  });
  
  it('should handle form submission', fakeAsync(() => {
  
  
    spyOn(component, 'prepareData').and.returnValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
    spyOn(httpRequestsService, 'postRequest').and.returnValue(of({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    }));
    spyOn(toastrService, 'success');
  
    component.formBuilding.setValue({
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 20,
    });
  
    const preparedData = component.prepareData();

    

    component.onSubmitForm();
   
    tick();

    expect(component.prepareData).toHaveBeenCalled();
    expect(httpRequestsService.postRequest).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalled();
  

  }));
});