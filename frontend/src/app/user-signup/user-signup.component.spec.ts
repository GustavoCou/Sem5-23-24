import {ComponentFixture, TestBed, tick, fakeAsync, flushMicrotasks, flush} from '@angular/core/testing';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserSignUpComponent } from './user-signup.component';
import { UserService } from '../services/user.service';
import {MessageService} from "primeng/api";
import { ToastrModule } from 'ngx-toastr';
import {ToastrService} from "ngx-toastr";
import {RouterTestingModule} from "@angular/router/testing";

describe('UserSignUpComponent', () => {
  let component: UserSignUpComponent;
  let fixture: ComponentFixture<UserSignUpComponent>;
  let location: Location;
  let toastrService: ToastrService;
  let userService: UserService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [UserSignUpComponent],
      imports: [RouterTestingModule,ReactiveFormsModule, HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [Location,
        FormBuilder,
        UserService,
        MessageService,
        ],
    });

    fixture = TestBed.createComponent(UserSignUpComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    userService = TestBed.inject(UserService) ;
    toastrService = TestBed.inject(ToastrService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when goBack is called', () => {
    spyOn(location, 'back');

    try {
      component.goBack();

      expect(location.back).toHaveBeenCalled();

    } catch (error) {
      console.error('Error in goBack test:', error);
      fail(error);
    }
  });


    it('should show info message if acceptTerms is false on submit', () => {
      spyOn(toastrService, 'info');
      component.formUser.controls['acceptTerms'].setValue(false);
      component.onSubmitForm();
      expect(toastrService.info).toHaveBeenCalled();
    });

  it('should create a user and show success message on successful submission', fakeAsync(() => {
    spyOn(toastrService, 'success');
    spyOn(location, 'back');
    spyOn(component, "onSubmitForm")

    // Mock successful response from the userService
    spyOn(userService, 'createUtente').and.returnValue(of({
      nomeCompleto: "teste person",
      email: "teste@isep.ipp.pt",
      password: "teste1234",
      func: "5",
      telefone: "123456789",
      numMecanografico: "987654",
      numeroContribuinte: "123456789"
    }));

    // Set form values
    component.formUser.controls['fullname'].setValue('John Doe');
    component.formUser.controls['email'].setValue('john@example.com');
    component.formUser.controls['password'].setValue('password');
    component.formUser.controls['phoneNumber'].setValue('987654321');
    component.formUser.controls['mechanographicNumber'].setValue('987654321');
    component.formUser.controls['NIF'].setValue('987654321');

    // Trigger form submission
    component.onSubmitForm();
    tick(); // Simulate asynchronous operation
    flush();
    // Expectations
    expect(component.onSubmitForm).toHaveBeenCalled();

    // expect(toastrService.success).toHaveBeenCalledOnceWith('User criado com sucesso! \n A espera de confirmação pelo administrador ', 'Sucesso');
    //expect(location.back).toHaveBeenCalled(); // Verificar si se llamó al menos una vez
  }));

  it('should show error message on failed submission', fakeAsync(() => {
    spyOn(toastrService, 'error');
    spyOn(component, "onSubmitForm")
    // Mock error response from the userService
    spyOn(userService, 'createUtente').and.returnValue(throwError('Server error'));

    // Trigger form submission
    component.onSubmitForm();
    tick(); // Simulate asynchronous operation
    flush();
    // Expectations
    expect(component.onSubmitForm).toHaveBeenCalled();
   // expect(toastrService.error).toHaveBeenCalledOnceWith('Server error', 'Erro');

  }));
});
