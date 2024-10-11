import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTaskNotApprovedComponent } from './list-task-not-approved.component';
import { HttpRequestsTaskService } from 'src/app/services/http-requests-task.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskRequestDTO } from 'src/app/dto/TaskRequestDTO';



describe('ListTaskNotApprovedComponent', () => {
  let component: ListTaskNotApprovedComponent;
  let fixture: ComponentFixture<ListTaskNotApprovedComponent>;

  let mockSpinnerService;

  let mockLocationService;
  let mockHttpService: jasmine.SpyObj<HttpRequestsTaskService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;


  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj(['getRequest', 'putRequest']);
    mockSpinnerService = jasmine.createSpyObj(['show', 'hide']);
    mockToastrService = jasmine.createSpyObj(['info', 'error', 'success']);
    mockLocationService = jasmine.createSpyObj(['replaceState']);

    TestBed.configureTestingModule({
      declarations: [ListTaskNotApprovedComponent],
      providers: [
        { provide: HttpRequestsTaskService, useValue: mockHttpService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Location, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTaskNotApprovedComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call pendingRequest', () => {
      spyOn(component, 'pendingRequest');
      component.ngOnInit();
      expect(component.pendingRequest).toHaveBeenCalled();
    });


    it('should list taskPending', () => {
      const mockTaskRequestDTOs: TaskRequestDTO[] = [
        { id: '1', requesterUser: 'User1', robot: 'Robot1', task: 'Task1', status: 'Pending', date: new Date('2023-01-01') },
        { id: '2', requesterUser: 'User2', robot: 'Robot2', task: 'Task2', status: 'Pending', date: new Date('2023-01-02') }

      ];
      const mockResponse = { taskRequestDto: mockTaskRequestDTOs };

      mockHttpService.getRequest.and.returnValue(of(mockResponse));
      component.pendingRequest();
      fixture.detectChanges();

      expect(component.taskPending.length).toBe(mockTaskRequestDTOs.length);
      expect(component.taskPending).toEqual(jasmine.arrayContaining([
        jasmine.objectContaining({ id: '1', requesterUser: 'User1', robot: 'Robot1', task: 'Task1', status: 'Pending', date: jasmine.any(Date) }),
        jasmine.objectContaining({ id: '2', requesterUser: 'User2', robot: 'Robot2', task: 'Task2', status: 'Pending', date: jasmine.any(Date) })

      ]));
    });


    it('should show info message when there are no pending requests', () => {
      mockHttpService.getRequest.and.returnValue(of({ taskRequestDto: [] }));
      component.pendingRequest();
      fixture.detectChanges();
      expect(mockToastrService.info).toHaveBeenCalledWith('Não existem requisiçoes pendentes');
    });

    it('should show error message on connection error', () => {
      const errorResponse = new HttpErrorResponse({ error: 'test 404 error', status: 0 });
      mockHttpService.getRequest.and.returnValue(throwError(() => errorResponse));
      component.pendingRequest();
      fixture.detectChanges();
      expect(mockToastrService.error).toHaveBeenCalledWith('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
    });

    it('should handle other errors gracefully', () => {
      const errorResponse = new HttpErrorResponse({ error: 'test error', status: 500 });
      mockHttpService.getRequest.and.returnValue(throwError(() => errorResponse));
      component.pendingRequest();
      fixture.detectChanges();
      expect(mockToastrService.error).toHaveBeenCalledWith('Erro ao carregar lista de tarefas. Tente novamente mais tarde.', 'Erro');
    });


  });

});
