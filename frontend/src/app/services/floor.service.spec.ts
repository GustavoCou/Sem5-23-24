import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FloorService } from './floor.service';
import { Floor } from '../dto/floor';
import Building from '../dto/building';


describe('FloorService', () => {
  let service: FloorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FloorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Para garantir que todas as solicitações foram tratadas
    httpMock.expectNone({});
  });

  describe('createFloor', () => {
    it('should create a floor', () => {
      const mockFloor: Floor = {
        id: 'Floor A1',
        floorDescription: 'Salas T',
        floorSize: { width: 9, depth: 8 },
        building: 'A',
      };

      service.createFloor(mockFloor).subscribe(floor => {
        expect(floor).toEqual(mockFloor);
      });

      const req = httpMock.expectOne('http://localhost:4000/api/floor/create');
      expect(req.request.method).toBe('POST');
      req.flush(mockFloor);
    });
  });

  describe('updateFloor', () => {
    it('should update a floor', () => {
      const mockFloor: Floor = {
        id: 'Floor A1',
        floorDescription: 'Auditórios',
        floorSize: { width: 9, depth: 6 },
        building: 'A',
      };

      service.updateFloor(mockFloor).subscribe(floor => {
        expect(floor).toEqual(mockFloor);
      });

      const req = httpMock.expectOne('http://localhost:4000/api/floor/edit');
      expect(req.request.method).toBe('PATCH');
      req.flush(mockFloor);
    });
  });

  describe('getFloors', () => {
    it('should return an Observable<Floor[]>', () => {
      const mockFloors: Floor[] = [
        {
          id: 'Floor A1',
          floorDescription: 'Auditórios',
          floorSize: { width: 9, depth: 6 },
          building: 'A',
        },
        {
          id: 'Floor B2',
          floorDescription: 'Salas de Aula',
          floorSize: { width: 8, depth: 7 },
          building: 'B',
        },
      ];

      service.getFloors().subscribe(floors => {
        expect(floors).toEqual(mockFloors);
      });

      const req = httpMock.expectOne('http://localhost:4000/api/floor/get');
      expect(req.request.method).toBe('GET');
      req.flush(mockFloors);
    });
  });

  
  describe('getFloorsByBuildingID', () => {
    it('should return an Observable<Floor[]>', () => {
      const mockBuildingid : string = 'A';
     

      const expectFloors: Floor[] = [
        {
          id: 'Floor A1',
          floorDescription: 'Auditórios',
          floorSize: { width: 5, depth: 6 },
          building: 'A',
        },
        {
          id: 'Floor A2',
          floorDescription: 'Salas de Aula',
          floorSize: { width: 8, depth: 8 },
          building: 'A',
        },
     
      ];

      service.getFloorsByBuildingId(mockBuildingid).subscribe(floors => {
        expect(floors).toEqual(expectFloors);
      });

      const req = httpMock.expectOne(`http://localhost:4000/api/floor/get/${mockBuildingid}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectFloors);
    });
  });

  describe('getBuildingsInFloorRange', () => {
    it('should return buildings within the floor range', () => {
      const minFloors = 2;
      const maxFloors = 5;
      
      const mockBuildings = [
        { buildingId: 'A', floorIds: ['Floor A1', 'Floor A2'], totalFloors: 2 },
        { buildingId: 'B', floorIds: ['Floor B1', 'Floor B2'], totalFloors: 2 },
      ];

      service.getBuildingsInFloorRange(minFloors, maxFloors).subscribe(buildings => {
        expect(buildings).toEqual(mockBuildings);
      });

      const expectedUrl = `http://localhost:4000/api/floor/floorsInRange?minFloors=${minFloors}&maxFloors=${maxFloors}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockBuildings);
    });
  });


  
  describe('uploadMap', () => {
    it('should return an Observable<Floor>', () => {
      const mockBuildingid : string = 'A';
     

      const expectFloor = new FormData();
      expectFloor.append('id', 'Floor A2');
      expectFloor.append('floorDescription', 'Salas de Aula');
      expectFloor.append('floorSize', JSON.stringify({ width: 8, depth: 8 }));
      expectFloor.append('floorMap', JSON.stringify({
        maze: {
          size: { width: 8, depth: 7 },
          map: [
            [3, 2, 2, 2, 2, 3, 2, 2, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1],
            [2, 2, 2, 0, 2, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 2, 2, 2, 2, 2, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [2, 2, 2, 2, 2, 2, 2, 2, 0]
          ],
          exits: [
            [2, -1],
            [5, 8]
          ],
          elevators: [
            [2, 8]
          ],
          exitLocation: [2, 8]
        },
        ground: {
          size: { width: 8, height: 0.0625, depth: 7 },
          segments: { width: 1, height: 1, depth: 1 },
          primaryColor: "0xffffff",
          maps: {
            color: { url: "./textures/ground_0003_2k_372HqZ/ground_0003_color_2k.jpg" },
            ao: { url: "./textures/ground_0003_2k_372HqZ/ground_0003_ao_2k.jpg", intensity: 1 },
            displacement: { url: "", scale: 1, bias: 0 },
            normal: { url: "./textures/ground_0003_2k_372HqZ/ground_0003_normal_opengl_2k.png", type: 0, scale: { x: 2, y: 2 } },
            bump: { url: "", scale: 1 },
            roughness: { url: "./textures/ground_0003_2k_372HqZ/ground_0003_roughness_2k.jpg", rough: 1 }
          },
          wrapS: 1,
          wrapT: 1,
          repeat: { u: 4, v: 4 },
          magFilter: 1,
          minFilter: 5,
          secondaryColor: "0x6b554b"
        },
        wall: {
          segments: { width: 1, height: 1 },
          primaryColor: "0xffffff",
          maps: {
            color: { url: "./textures/concrete_0007_2k_xtGY5J/concrete_0007_color_2k.jpg" },
            ao: { url: "./textures/concrete_0007_2k_xtGY5J/concrete_0007_ao_2k.jpg", intensity: 1 },
            displacement: { url: "", scale: 1, bias: 0 },
            normal: { url: "./textures/concrete_0007_2k_xtGY5J/concrete_0007_normal_opengl_2k.png", type: 0, scale: { x: 2, y: 2 } },
            bump: { url: "", scale: 1 },
            roughness: { url: "./textures/concrete_0007_2k_xtGY5J/concrete_0007_roughness_2k.jpg", rough: 1 }
          },
          wrapS: 1,
          wrapT: 0,
          repeat: { u: 2, v: 1 },
          magFilter: 1,
          minFilter: 5,
          secondaryColor: "0x6b554b"
        },
        player: {
          initialPosition: [3, 0],
          initialDirection: 90
        }
      }));
      expectFloor.append('building', 'A');

      service.uploadMap(expectFloor).subscribe(floor => {
        expect(floor).toEqual(expectFloor);
      });

      const req = httpMock.expectOne(`http://localhost:4000/api/floor/uploadmap`);
      expect(req.request.method).toBe('PATCH');
      req.flush(expectFloor);
    });
  });
  
});