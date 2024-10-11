import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RobotTypeService } from './robotType.service';
import { RobotType } from '../dto/robotType';


describe('RobotTypeService', () => {
  let service: RobotTypeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RobotTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Para garantir que todas as solicitações foram tratadas
    httpMock.expectNone({});
  });

  describe('createRobotType', () => {
    it('should create a robotType', () => {
      const mockRobotType: RobotType = {
        id: "0012",
        robotModel: "Reanult",
        brand: "Clio",
        tasks: "Pickup & Delivery"
      };

      service.createRobotType(mockRobotType).subscribe(robotType => {
        expect(robotType).toEqual(mockRobotType);
      });

      const req = httpMock.expectOne('http://localhost:4000/api/robotType/create');
      expect(req.request.method).toBe('POST');
      req.flush(mockRobotType);
    });
  });
  
});