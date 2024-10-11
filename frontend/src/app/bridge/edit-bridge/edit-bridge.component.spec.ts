import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EditBridgeComponent } from './edit-bridge.component';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { of, throwError } from 'rxjs';

describe('EditBridgeComponent', () => {
    let component: EditBridgeComponent;
    let fixture: ComponentFixture<EditBridgeComponent>;
    let httpServiceSpy: jasmine.SpyObj<HttpRequestsService>;
    let toastUserMessageServiceSpy: jasmine.SpyObj<ToastrService>;
    let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

    beforeEach(() => {
        const spyHttp = jasmine.createSpyObj('HttpRequestsService', ['getRequest', 'postRequest', 'putRequest']);
        const spyToast = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
        const spySpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);



        TestBed.configureTestingModule({
            declarations: [EditBridgeComponent],
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

        fixture = TestBed.createComponent(EditBridgeComponent);
        component = fixture.componentInstance;
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle form submission with valid data', fakeAsync(() => {

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
        const bridgeId = 123;
        httpServiceSpy.putRequest.and.returnValue(of({ status: true }));


        component.onSubmitForm();
        tick();


        expect(component.prepareData).toHaveBeenCalled();
        expect(httpServiceSpy.putRequest).toHaveBeenCalledWith('bridge/' + bridgeId, formValue);
        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.success).toHaveBeenCalledWith('Passagem Editada com sucesso', 'Successo');
    }));

    it('should handle form submission with server connection error', fakeAsync(() => {

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
        const bridgeId = 123; // replace with an appropriate value
        httpServiceSpy.putRequest.and.returnValue(throwError({ status: 0 }));


        component.onSubmitForm();
        tick();


        expect(component.prepareData).toHaveBeenCalled();
        expect(httpServiceSpy.putRequest).toHaveBeenCalledWith('bridge/' + bridgeId, formValue);
        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith(
            'Erro de conexão. Certifique-se de que o servidor está em execução.',
            'Erro'
        );
    }));

    it('should not submit and set isFormValid to false if form is invalid', () => {
        component.bridgeForm.setErrors({ invalid: true });
        component.onSubmitForm();
        expect(httpServiceSpy.putRequest).not.toHaveBeenCalled();
        expect(component.isFormValid).toBeFalse();
    });


    it('should handle other errors on form submission', () => {
        const mockFormData: any = {
            bridgeId: 1212,
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
        const mockError = { status: 500, error: { error: { name: 'Server Error' } } };
        httpServiceSpy.putRequest.and.returnValue(throwError(mockError));

        component.onSubmitForm();

        expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith('Erro ao editar a passagem. Server Error', 'Erro');
    });

    it('should update floors and form with empty array if no buildingId provided', () => {
        spyOn(component, 'updateFloorsAndForm');
        component.getFloorsForBuilding('', 'X');
        expect(component.updateFloorsAndForm).toHaveBeenCalledWith([], 'X', undefined);
    });

    it('should handle successful floor data fetch', fakeAsync(() => {
        let mockFloors = [
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
        httpServiceSpy.getRequest.and.returnValue(of(mockFloors));

        component.getFloorsForBuilding('123', 'X');
        tick();

        expect(component.floorsX).toEqual(mockFloors);
        expect(component['spinner'].hide).toHaveBeenCalled();

    }));

    it('should display info message if no floors are found', fakeAsync(() => {
        httpServiceSpy.getRequest.and.returnValue(of([]));

        component.getFloorsForBuilding('123', 'X');
        tick();

        expect(component['toastUserMessage'].info).toHaveBeenCalledWith('Nenhum Piso encontrado para o edificio selecionado');
    }));

    it('should handle error on floor fetch', fakeAsync(() => {
        const mockError = { status: 500, message: 'Internal Server Error' };
        httpServiceSpy.getRequest.and.returnValue(throwError(mockError));

        component.getFloorsForBuilding('123', 'X');
        tick();

        expect(component['toastUserMessage'].info).toHaveBeenCalledWith('Encontrado edificio sem piso', 'Erro');
    }));
    it('should handle error on floor fetch', fakeAsync(() => {
        const mockError = { status: 500, message: 'Error' };
        httpServiceSpy.getRequest.and.returnValue(throwError(mockError));

        component.getFloorsForBuilding('123', 'X');
        tick();

        expect(component['toastUserMessage'].info).toHaveBeenCalledWith('Encontrado edificio sem piso', 'Erro');
    }));

    it('should update floorsX and set floorIdX correctly', () => {
        let mockFloors = [
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
        ]; const selectedFloorId = 'A1';

        component.updateFloorsAndForm(mockFloors, 'X', selectedFloorId);

        expect(component.floorsX).toEqual(mockFloors);
        expect(component.bridgeForm.get('floorIdX')?.value).toEqual(selectedFloorId);
    });

});
