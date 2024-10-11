import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListFloorsBridgeComponent } from './list-floors-bridge.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { of, throwError } from 'rxjs';


describe('ListFloorsBridgeComponent', () => {
    let component: ListFloorsBridgeComponent;
    let fixture: ComponentFixture<ListFloorsBridgeComponent>;
    let httpServiceSpy: jasmine.SpyObj<HttpRequestsService>;
    let toastUserMessageServiceSpy: jasmine.SpyObj<ToastrService>;
    let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

    beforeEach(() => {
        const spyHttp = jasmine.createSpyObj('HttpRequestsService', ['postRequest', 'putRequest', 'getRequest']);
        const spyToast = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
        const spySpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
        TestBed.configureTestingModule({
            declarations: [ListFloorsBridgeComponent],
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

        fixture = TestBed.createComponent(ListFloorsBridgeComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle successful response', fakeAsync(() => {
        const mockResponse = {
            bridgeInformationDTO: [
                {
                    bridgeId: 'bridge123',
                    floorId: 'floor456',
                    linksToFloor: 'link-to-floor',
                    buildingId: 'building789',
                    linksToBuilding: 'link-to-building'
                }
            ]
        };
        httpServiceSpy.getRequest.and.returnValue(of(mockResponse));
        component.buildingId = 'bridge123';

        component.getFloorsOfBuilding();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(component.listData).toEqual(mockResponse.bridgeInformationDTO);
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

    it('should handle error response', fakeAsync(() => {
        const errorResponse = new ErrorEvent('Network error');
        httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));
        component.buildingId = 'A1';

        component.getFloorsOfBuilding();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Não existem pisos neste edificio com passagens');

    }));
    it('should load floors and update the component property', fakeAsync(() => {

        let mockFloors = [
            {
                id: "A1",
                floorDescription: "AA",
                floorSize: {
                    width: 10,
                    depth: 8
                },
                building: "A"
            },
            {
                id: "A2",
                floorDescription: "AA",
                floorSize: {
                    width: 10,
                    depth: 8
                },
                building: "A"
            }
        ];


        httpServiceSpy.getRequest.and.returnValue(of(mockFloors));

        component.loadFloors();
        tick();

        expect(httpServiceSpy.getRequest).toHaveBeenCalledWith('floor/get');
        expect(component.floors).toEqual(mockFloors);
    }));

    it('should show a toast message if no floors are available', fakeAsync(() => {
        httpServiceSpy.getRequest.and.returnValue(of([])); //COMO SE O ARRAY TIVESSE VAZIO

        component.loadFloors();
        tick();

        expect(httpServiceSpy.getRequest).toHaveBeenCalledWith('floor/get');
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith("Não existem pisos disponiveis");
    }));

    it('should load buildings and update the component property when data is present', fakeAsync(() => {
        const mockBuildings = [
            {
                id: 'A',
                name: 'Building A',
                description: 'Description Building A',
                width: 10,
                depth: 8
            },
        ];
        httpServiceSpy.getRequest.and.returnValue(of(mockBuildings));

        component.loadBuildings();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(component.buildings).toEqual(mockBuildings);
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

    it('should show a toast message if no buildings are available', fakeAsync(() => {
        httpServiceSpy.getRequest.and.returnValue(of([]));

        component.loadBuildings();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Nao existem edificios para escolher');

    }));

    it('should handle network errors', fakeAsync(() => {
        const errorResponse = { status: 0 };
        httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));

        component.loadBuildings();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.error).toHaveBeenCalledWith('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

    it('should handle general errors', fakeAsync(() => {
        const errorResponse = { status: 500, message: 'error' };
        httpServiceSpy.getRequest.and.returnValue(throwError(() => errorResponse));

        component.loadBuildings();
        tick();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Nao existem edificios para escolher');
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

}); 