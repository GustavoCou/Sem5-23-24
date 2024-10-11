import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import Building from '../dto/building';
import { BuildingService } from './building.service';

describe('BuildingService', () => {
  let service: BuildingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BuildingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Para garantir que todas as solicitações foram tratadas
    httpMock.expectNone({});
  });

  
  describe('getBuildings', () => {
    it('should return an Observable<Building[]>', () => {
      const mockBuildings: Building[] = [
        {
            id: 'A',
            name: 'Building A',
            description: 'Departamento de Eng Informática',
            width: 9,
            depth: 9,
        },
        {
            id: 'B',
            name: 'Building B',
            description: 'Departamento de Eng Mecanica',
            width: 9,
            depth: 9,
        },
      ];

      service.getBuildings().subscribe(buildings => {
        expect(buildings).toEqual(mockBuildings);
      });

      const req = httpMock.expectOne('http://localhost:4000/api/building/list');
      expect(req.request.method).toBe('GET');
      req.flush(mockBuildings);
    });
  });
});