import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequestsService } from './http-requests.service';
import { MessageService } from 'primeng/api';

describe('HttpRequestsService', () => {
    let service: HttpRequestsService;
    let httpTestingController: HttpTestingController;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpRequestsService,
                { provide: MessageService, useValue: messageServiceSpy }
            ]
        });

        service = TestBed.inject(HttpRequestsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should send a GET request', () => {
        const testUrl = 'caminhoFicticio';
        service.getRequest(testUrl).subscribe();

        const req = httpTestingController.expectOne(service.baseUrl + testUrl);
        expect(req.request.method).toEqual('GET');
        req.flush({});
    });

    it('should send a POST request with data', () => {
        const testUrl = 'caminhoficticio';
        const testData = { id: 'A1' };
        const mockResponse = { success: true, id: 123 };

        service.postRequest(testUrl, testData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(service.baseUrl + testUrl);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(testData);

        req.flush(mockResponse); //resposta mockada
    });


    it('should send a PUT request with data', () => {
        const testUrl = 'caminhoFicticio';
        const testData = { id: 'A2' };
        const mockResponse = { updated: true, id: 'A2' };

        service.putRequest(testUrl, testData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(service.baseUrl + testUrl);
        expect(req.request.method).toEqual('PATCH');
        expect(req.request.body).toEqual(testData);

        req.flush(mockResponse);
    });

    it('should show toast with given parameters', () => {
        const severity = 'info';
        const summary = 'para test summary';
        const detail = 'para test detail';
        const life = 4000;

        service.showTost(severity, summary, detail, life);

        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: severity,
            summary: summary,
            detail: detail,
            life: life,
        });
    });


});
