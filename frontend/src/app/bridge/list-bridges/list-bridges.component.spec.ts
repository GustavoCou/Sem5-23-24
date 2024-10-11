import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ListBridgesComponent } from './list-bridges.component';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import Bridge from 'src/app/dto/bridge';


describe('ListBridgesComponent', () => {
    let component: ListBridgesComponent;
    let fixture: ComponentFixture<ListBridgesComponent>;
    let httpServiceSpy: jasmine.SpyObj<HttpRequestsService>;
    let toastUserMessageServiceSpy: jasmine.SpyObj<ToastrService>;
    let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

    beforeEach(() => {
        const spyHttp = jasmine.createSpyObj('HttpRequestsService', ['postRequest', 'putRequest', 'getRequest']);
        const spyToast = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
        const spySpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
        TestBed.configureTestingModule({
            declarations: [ListBridgesComponent],
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

        fixture = TestBed.createComponent(ListBridgesComponent);
        component = fixture.componentInstance;
    });


    //component create
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle request when both building IDs are selected', fakeAsync(() => {
        // Arrange
        component.selectedBuildingId1 = '1';
        component.selectedBuildingId2 = '2';
        httpServiceSpy.getRequest.and.returnValue(of({ status: "success" }));


        component.onSubmitForm();
        tick();


        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(httpServiceSpy.getRequest).toHaveBeenCalledWith('bridge/1/2');
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    }));

    it('should handle successful fetch with enough buildings', () => {
        const mockBuildings = [
            { id: '1', name: 'Building 1', description: 'Desc 1', width: 10, depth: 10 },
            { id: '2', name: 'Building 2', description: 'Desc 2', width: 20, depth: 20 }
        ];

        httpServiceSpy.getRequest.and.returnValue(of(mockBuildings));

        component.loadBuildings();

        expect(component.buildings).toEqual(mockBuildings);
        expect(component.showInputFields).toBeTrue();
        expect(component.selectedBuildingId1).toEqual('');
        expect(component.selectedBuildingId2).toEqual('');
        expect(toastUserMessageServiceSpy.info).not.toHaveBeenCalled();
    });

    it('should display info message if not enough buildings are found', () => {

        //se so tiver um edificio nao da para consultar passagens entre 2 edificios
        const mockBuildings = [
            { id: '1', name: 'Building 1', description: 'Desc 1', width: 10, depth: 10 }];

        httpServiceSpy.getRequest.and.returnValue(of(mockBuildings));

        component.loadBuildings();

        expect(component.buildings).toEqual(mockBuildings);
        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Edifícios insuficientes, apenas poderá consultar todas as pontes.');
    });


    it('should handle successful fetch with bridges', () => {
        const mockBridges: Bridge[] = [{
            bridgeId: '123',
            floorIdX: '1',
            floorIdY: '2',
            buildingX: 'BuildingX',
            buildingY: 'BuildingY',
            bridgePositionX: { posX: 30, posY: 40 },
            bridgePositionY: { posX: 20, posY: 10 }
        }];
        httpServiceSpy.getRequest.and.returnValue(of(mockBridges));

        component.getAllBridges();

        expect(component.listData).toEqual(mockBridges);
        expect(toastUserMessageServiceSpy.info).not.toHaveBeenCalled();

    });



    it('should display info message if no bridges are found', fakeAsync(() => {
        component.selectedBuildingId1 = '1';
        component.selectedBuildingId2 = '2';
        httpServiceSpy.getRequest.and.returnValue(throwError({}));

        component.getBridgesBetweenBuildings();
        tick();

        expect(toastUserMessageServiceSpy.info).toHaveBeenCalledWith('Não há passagens entre os dois edificios selecionados');
    }));



});
