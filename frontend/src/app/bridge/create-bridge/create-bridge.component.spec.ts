import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner'; // Assuming you are using ngx-spinner
import { of, throwError } from 'rxjs';
import { CreateBridgeComponent } from './create-bridge.component';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';


describe('CreateBridgeComponent', () => {
    let component: CreateBridgeComponent;
    let fixture: ComponentFixture<CreateBridgeComponent>;
    let httpServiceSpy: jasmine.SpyObj<HttpRequestsService>;
    let toastUserMessageServiceSpy: jasmine.SpyObj<ToastrService>;
    let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

    beforeEach(() => {
        const spyHttp = jasmine.createSpyObj('HttpService', ['postRequest', 'getRequest']);
        const spyToast = jasmine.createSpyObj('ToastUserMessageService', ['success', 'error', 'info']);
        const spySpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);


        TestBed.configureTestingModule({
            declarations: [CreateBridgeComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, ToastModule],
            providers: [
                { provide: HttpRequestsService, useValue: spyHttp },
                { provide: ToastrService, useValue: spyToast },
                { provide: NgxSpinnerService, useValue: spySpinner },
                MessageService
            ],
        });

        httpServiceSpy = TestBed.inject(HttpRequestsService) as jasmine.SpyObj<HttpRequestsService>;
        toastUserMessageServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        spinnerServiceSpy = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

        fixture = TestBed.createComponent(CreateBridgeComponent);
        component = fixture.componentInstance;
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle form submission with valid data', () => {

        const formValue: any = {
            bridgeId: 123,
            buildingIdX: 12,
            buildingIdY: 23,
            floorIdX: 1,
            floorIdY: 2,


            bridgeXPosX: 30,
            bridgeXPosY: 40,
            bridgeYPosX: 20,
            bridgeYPosY: 10,


        };
        component.bridgeForm.setValue(formValue);
        spyOn(component, 'prepareData').and.returnValue(formValue);
        httpServiceSpy.postRequest.and.returnValue(of({}));

        component.onSubmitForm();

        expect(component.prepareData).toHaveBeenCalled();
        expect(httpServiceSpy.postRequest).toHaveBeenCalledWith('bridge', formValue);
        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.success).toHaveBeenCalledWith('Passagem Criada com sucesso', 'Successo');
    });

    it('should handle form submission with errors', () => {

        const mockFormData: any = {
            bridgeId: 123,
            buildingIdX: 12,
            buildingIdY: 23,
            floorIdX: 1,
            floorIdY: 2,
            bridgeXPosX: 30,
            bridgeXPosY: 40,
            bridgeYPosX: 20,
            bridgeYPosY: 10,

        };
        component.bridgeForm.setValue(mockFormData);
        spyOn(component, 'prepareData').and.returnValue(mockFormData);
        const errorResponse = { status: 'false', error: 'server error' };
        httpServiceSpy.postRequest.and.returnValue(throwError(errorResponse));

        component.onSubmitForm();

        expect(component.prepareData).toHaveBeenCalled();
        expect(httpServiceSpy.postRequest).toHaveBeenCalledWith('bridge', mockFormData);
        expect(spinnerServiceSpy.show).toHaveBeenCalled();

    });

    it('should handle form submission with server connection error', () => {

        const mockFormData: any = {
            bridgeId: 123,
            buildingIdX: 12,
            buildingIdY: 23,
            floorIdX: 1,
            floorIdY: 2,
            bridgeXPosX: 30,
            bridgeXPosY: 40,
            bridgeYPosX: 20,
            bridgeYPosY: 10,

        }; component.bridgeForm.setValue(mockFormData);
        spyOn(component, 'prepareData').and.returnValue(mockFormData);
        httpServiceSpy.postRequest.and.returnValue(throwError({ status: 0 }));

        component.onSubmitForm();

        expect(component.prepareData).toHaveBeenCalled();
        expect(httpServiceSpy.postRequest).toHaveBeenCalledWith('bridge', mockFormData);
        expect(spinnerServiceSpy.show).toHaveBeenCalled();

    });


    it('should not submit invalid form data', () => {

        component.bridgeForm.patchValue({
            bridgeId: null, // valor invalido
        });

        component.onSubmitForm();

        expect(httpServiceSpy.postRequest).not.toHaveBeenCalled();

    });

    it('should display an info message and set buildings to an empty array if no building is found', () => {
        httpServiceSpy.getRequest = jasmine.createSpy().and.returnValue(of([]));

        component.getBuildings();

        expect(component.buildings).toEqual([]);
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Não existem edificios suficientes para criar uma passagem.');
    });


    it('should successfully fetch buildings and update component data', () => {

        const mockBuildings = [
            { id: '1', name: 'Building 1', description: 'Desc 1', width: 10, depth: 10 },
            { id: '2', name: 'Building 2', description: 'Desc 2', width: 20, depth: 20 }
        ];

        httpServiceSpy.getRequest = jasmine.createSpy().and.returnValue(of(mockBuildings));

        component.getBuildings();

        expect(component.buildings).toEqual(mockBuildings);

        expect(toastUserMessageServiceSpy.info).not.toHaveBeenCalled();
    });

    it('should display info message if no floors are found', fakeAsync(() => {
        httpServiceSpy.getRequest = jasmine.createSpy().and.returnValue(of([]));

        component.getFloorsForBuilding('1', 'X');
        tick(); //finge passagem do tempo ate terminar de excutar a acao

        expect(component.floorsX).toEqual([]);
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Nenhum Piso encontrado para o edificio selecionado');
    }));

    it('should handle successful floor data fetch', () => {
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
        httpServiceSpy.getRequest = jasmine.createSpy().and.returnValue(of(floorsMockData));

        component.getFloorsForBuilding('A1', 'X');
        expect(component.floorsX).toEqual(floorsMockData);
        expect(toastUserMessageServiceSpy.info).not.toHaveBeenCalled();
    });


});