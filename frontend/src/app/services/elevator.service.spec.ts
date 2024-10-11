import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElevatorService } from './elevator.service';

describe('ElevatorService', () => {
  let service: ElevatorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorService);
  });

  afterEach(() => {
    httpMock.verify();
    // Para garantir que todas as solicitações foram tratadas
    httpMock.expectNone({});
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
