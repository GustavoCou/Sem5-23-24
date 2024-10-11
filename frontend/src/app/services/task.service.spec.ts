import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TaskService} from './task.service';
import {TaskDTO} from '../dto/TaskDTO';
import {TaskRequestDTO} from '../dto/TaskRequestDTO';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a task successfully', () => {
    const mockTask: TaskDTO = {
      robot: "0001",
      type: "securityTask",
      building: "B",
      floors: ["B2", "B1"],
      emergencyContact: {
        name: "44",
        phone: 123456789

      }
    };

    const mockResponse: TaskRequestDTO = {
      id: "658ca339aef2bcf938d19b81",
      requesterUser: "RequestedUser",
      robot: "0001",
      task: "73f0c3d7-46f9-405c-b834-8c3bc6f78c6b",
      status: "Pending",
      date: new Date()
    }

    service.createTask(mockTask).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4001/api/task');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle HTTP error during task creation',  fakeAsync(() =>  {
    const mockTask: TaskDTO = {
      robot: "0001",
      type: "securityTask",
      building: "B",
      floors: ["B2", "B1"],
      emergencyContact: {
        name: "44",
        phone: 123456789
      }
      };
      const errorMessage = 'Método HTTP inválido.'; // Ajusta el mensaje de error según tus necesidades
    let errorResponse: any;

    service.createTask(mockTask, 'invalidMethod').subscribe(
        () => fail('Expected to fail with an error'),
        (error) => {
          expect(error).toBe(errorMessage);
          errorResponse=error
        }
      );

    tick();

    // Verifica el tipo de error y el mensaje
    expect(errorResponse).toBeDefined();
    expect(errorResponse).toBe(errorMessage)
  }));




});
