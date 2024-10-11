import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveRejectUserComponent } from './approve-reject-user.component'
import { HttpRequestsUsersService } from 'src/app/services/http-requests-users.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import UserDTO from 'src/app/dto/UserDTO';
import { HttpErrorResponse } from '@angular/common/http';



describe('ApproveRejectUserComponent', () => {
  let component: ApproveRejectUserComponent;
  let fixture: ComponentFixture<ApproveRejectUserComponent>;

  let mockSpinnerService;

  let mockLocationService;
  let mockHttpService: jasmine.SpyObj<HttpRequestsUsersService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;


  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj(['getRequest', 'putRequest']);
    mockSpinnerService = jasmine.createSpyObj(['show', 'hide']);
    mockToastrService = jasmine.createSpyObj(['info', 'error', 'success']);
    mockLocationService = jasmine.createSpyObj(['replaceState']);

    TestBed.configureTestingModule({
      declarations: [ApproveRejectUserComponent],
      providers: [
        { provide: HttpRequestsUsersService, useValue: mockHttpService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Location, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveRejectUserComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call pendingUtentes on ngOnInit', () => {
      spyOn(component, 'pendingUtentes');
      component.ngOnInit();
      expect(component.pendingUtentes).toHaveBeenCalled();
    });

    it('should show info message when there are no pending users', () => {
      mockHttpService.getRequest.and.returnValue(of([]));
      component.pendingUtentes();
      expect(mockToastrService.info).toHaveBeenCalledWith('Não existem utentes pendentes de aceitação');
    });

    it('should update user list on successful pendingUtentes', () => {

      const mockUsers = [
        {
          nomeCompleto: 'João Silva',
          email: 'joao@example.com',
          password: '123456',
          func: 'Funcionário',
          telefone: '123456789',
          numMecanografico: '1234',
          numeroContribuinte: '123456789',
          approvalStatus: 0
        },
        {
          nomeCompleto: 'Maria Souza',
          email: 'maria@example.com',
          password: 'senha123',
          func: 'Funcionária',
          telefone: '987654321',
          numMecanografico: '4321',
          numeroContribuinte: '987654321',
          approvalStatus: 0
        }
      ];

      mockHttpService.getRequest.and.returnValue(of(mockUsers));

      component.pendingUtentes();


      expect(component.user.length).toBeGreaterThan(0);
      expect(component.user.length).toEqual(mockUsers.length);
      expect(component.user[0].email).toEqual(mockUsers[0].email);
      expect(component.user[1].email).toEqual(mockUsers[1].email);
    });

    it('should remove user from list and show success message on approve', () => {

      const utente = {
        nomeCompleto: 'Ana Pereira',
        email: 'ana@example.com',
        password: 'senha123',
        func: 'Funcionária',
        telefone: '987654321',
        numMecanografico: '5678',
        numeroContribuinte: '987654321',
        approvalStatus: 0 // Status inicial
      };


      const response: UserDTO = { ...utente, approvalStatus: 1 };
      mockHttpService.putRequest.and.returnValue(of(response));

      component.user = [utente];

      component.approve(utente);


      expect(mockToastrService.success).toHaveBeenCalledWith('Pedido de registo aceite com sucesso');


      expect(component.user).not.toContain(utente);
      expect(component.user.length).toBe(0); //como so tem um depois de aceite fica vzzia a lista
    });

    it('should remove user from list and show success message on reject', () => {

      const utente = {
        nomeCompleto: 'Carlos Dias',
        email: 'carlos@example.com',
        password: 'senha456',
        func: 'Funcionário',
        telefone: '123456789',
        numMecanografico: '9012',
        numeroContribuinte: '123456789',
        approvalStatus: 0 // Status inicial
      };


      const response: UserDTO = { ...utente, approvalStatus: 2 };
      mockHttpService.putRequest.and.returnValue(of(response));

      component.user = [utente];
      component.reject(utente);
      expect(mockToastrService.success).toHaveBeenCalledWith('Pedido de registo recusado com sucesso');

      expect(component.user).not.toContain(utente);

      expect(component.user.length).toBe(0);
    });

    it('should show error message on connection error', () => {
      const errorResponse = new HttpErrorResponse({ error: 'test 404 error', status: 0 });
      mockHttpService.getRequest.and.returnValue(throwError(() => errorResponse));
      component.pendingUtentes();
      fixture.detectChanges();
      expect(mockToastrService.error).toHaveBeenCalledWith('Erro de conexão. Certifique-se de que o servidor está em execução.', 'Erro');
    });

    it('should handle other errors gracefully', () => {
      const errorResponse = new HttpErrorResponse({ error: 'test error', status: 500 });
      mockHttpService.getRequest.and.returnValue(throwError(() => errorResponse));
      component.pendingUtentes();
      fixture.detectChanges();
      expect(mockToastrService.error).toHaveBeenCalledWith('Erro ao carregar lista de utentes. Tente novamente mais tarde.', 'Erro');
    });

  })
});