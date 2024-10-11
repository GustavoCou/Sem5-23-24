import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateElevatorComponent } from './create-elevator.component';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


describe('CreateElevatorComponent', () => {
  let component: CreateElevatorComponent;
  let fixture: ComponentFixture<CreateElevatorComponent>;
  let httpServiceSpy: jasmine.SpyObj<HttpRequestsService>;
  let toastUserMessageServiceSpy: jasmine.SpyObj<ToastrService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {


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

    const spyHttp = jasmine.createSpyObj('HttpRequestsService', ['postRequest', 'getRequest']);
    spyHttp.getRequest.and.returnValue(of(buildingsMockData));
    spyHttp.getRequest.and.returnValue(of(floorsMockData));


    const spyToast = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
    const spySpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    TestBed.configureTestingModule({
      declarations: [CreateElevatorComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, ToastModule],
      providers: [
        { provide: HttpRequestsService, useValue: spyHttp },
        { provide: ToastrService, useValue: spyToast },
        { provide: NgxSpinnerService, useValue: spySpinner },
        MessageService,
      ],
    });

    httpServiceSpy = TestBed.inject(HttpRequestsService) as jasmine.SpyObj<HttpRequestsService>;
    toastUserMessageServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    spinnerServiceSpy = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    fixture = TestBed.createComponent(CreateElevatorComponent);
    component = fixture.componentInstance;
    httpServiceSpy.postRequest.calls.reset();

  });


  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('should submit the form when valid', () => {
    fixture.detectChanges();

    component.elevatorForm.setValue({
      elevatorId: '1234',
      buildingId: '456',
      elevatorPosY: 10,
      elevatorPosX: 10,
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: '124',
      elevatorDescription: 'Description',
    });

    component.floorIds = [{ id: '1' }, { id: '2' }];

    httpServiceSpy.postRequest.and.returnValue(of({}));
    toastUserMessageServiceSpy.success.and.stub();

    component.onSubmitForm();

    expect(httpServiceSpy.postRequest).toHaveBeenCalledWith('elevator', jasmine.any(Object));

    const expectedRequestData = {
      elevatorId: '1234',
      buildingId: '456',
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: '124',
      elevatorDescription: 'Description',
      elevatorPosition: {
        posX: 10,
        posY: 10,
      },
      floorIds: ['1', '2'],
    };

    expect(httpServiceSpy.postRequest.calls.mostRecent().args[1]).toEqual(expectedRequestData);


    expect(toastUserMessageServiceSpy.success).toHaveBeenCalledWith('Elevador Criado com Sucesso', 'Successo');
  });

  it('should fail submission checking the validateFloorIds', async () => {
    fixture.detectChanges();

    component.isFormValid = true;
    spyOn(component, 'validateFloorIds').and.returnValue(false);

    component.onSubmitForm();

    expect(component.isFormValid).toBeFalse();

  });



  it('should fail submission due to form validation', () => {
    fixture.detectChanges();

    // Configurar o formulário para ser inválido
    component.elevatorForm.setValue({
      elevatorId: '1234AAAAAAA',
      buildingId: '456',
      elevatorPosY: 10,
      elevatorPosX: 10,
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: 'aqaq',
      elevatorDescription: 'Description',
    });


    component.onSubmitForm();

    expect(component.isFormValid).toBeFalse();
  });





  it('should add a new floor ID object when onAddFloorId is called', () => {
    const initialLength = component.floorIds.length;
    component.onAddFloorId();
    const newLength = component.floorIds.length;

    expect(newLength).toBe(initialLength + 1);
    expect(component.floorIds[newLength - 1]).toEqual({ id: '' });
  });
  it('should remove the floor ID at specified index if there are more than one floor IDs', () => {
    // dois pisos so para dizer que tem
    component.floorIds = [{ id: '1' }, { id: '2' }];

    // remover um index, ex: 0
    const removeIndex = 0;
    component.onRemoveFloorId(removeIndex);

    expect(component.floorIds.length).toBe(1);

    expect(component.floorIds.findIndex((item: { id: string; }) => item.id === '1')).toBe(-1);
  });

  it('should not remove the floor ID if it is the only one in the array', () => {

    component.floorIds = [{ id: 'test' }];
    component.onRemoveFloorId(0);

    expect(component.floorIds.length).toBe(1);
  });


  it('should return false if floorIds array is empty', () => {
    component.floorIds = [];
    const result = component.validateFloorIds();
    expect(result).toBeFalse();
  });

  it('should set buildings data when retrieved successfully', () => {
    let buildingsMocK = [
      {
        id: 'A',
        name: 'Building A',
        description: 'Description Building A',
        width: 10,
        depth: 8
      },
    ]; httpServiceSpy.getRequest.and.returnValue(of(buildingsMocK));

    component.getBuildings();
    expect(component.buildings).toEqual(buildingsMocK);
  });

  it('should display an info message and set buildings to an empty array if no building is found', () => {
    httpServiceSpy.getRequest.and.returnValue(of([]));

    component.getBuildings();
    expect(component.buildings).toEqual([]);
    expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Nenhum Edificio encontrado. Não é possivel criar elevador');
  });

  it('should display a connection error message for status 0', () => {
    const errorResponse = new HttpErrorResponse({ status: 0, error: 'Connection error' });
    httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));

    component.getBuildings();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
  });

  it('should display a generic error message for not upload buildings', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, error: 'Server error' });
    httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));

    component.getBuildings();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith('Erro ao carregar edifícios. Tente novamente mais tarde.', 'Erro');
  });

  it('should return the floorData when valid', () => {
    let floorsMockData = [
      {
        id: "A1",
        floorDescription: "a",
        floorSize: {
          width: 1,
          depth: 1
        },
        building: "A"
      },
      {
        id: "A2",
        floorDescription: "a2",
        floorSize: {
          width: 17,
          depth: 18
        },
        building: "A"
      }
    ];

    httpServiceSpy.getRequest.and.returnValue(of(floorsMockData));

    component.elevatorForm.setValue({
      elevatorId: 'A5',
      buildingId: 'A',
      elevatorPosY: 10,
      elevatorPosX: 10,
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: '123488',
      elevatorDescription: 'Description',
    });

    component.onBuildingChange();
    expect(component.floors).toEqual(floorsMockData);
  });

  it('should return info message when floors array is empty', () => {
    httpServiceSpy.getRequest.and.returnValue(of([]));
    component.elevatorForm.setValue({
      elevatorId: 'A5',
      buildingId: 'A',
      elevatorPosY: 10,
      elevatorPosX: 10,
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: '123488',
      elevatorDescription: 'Description',
    });

    component.onBuildingChange();
    expect(component.floors).toEqual([]);
    expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('O edifício selecionado não tem pisos.');
  });

  it('send message when http request fail because server is not accessible', () => {
    const errorResponse = new HttpErrorResponse({ status: 0, error: 'Erro no servidor' });
    httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));
    component.elevatorForm.setValue({
      elevatorId: 'A5',
      buildingId: 'A',
      elevatorPosY: 10,
      elevatorPosX: 10,
      elevatorBrand: 'Brand',
      elevatorModel: 'Model',
      elevatorSerialNumber: '123488',
      elevatorDescription: 'Description',
    });

    component.onBuildingChange();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith('Erro no servidor', 'Erro');
  });

});