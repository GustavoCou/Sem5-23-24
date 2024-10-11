import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { RobotTypeComponent } from './robot-type.component';
import { RobotTypeService } from '../services/robotType.service';
import { RobotType } from '../dto/robotType';

describe('RobotTypeComponent', () => {
  let component: RobotTypeComponent;
  let fixture: ComponentFixture<RobotTypeComponent>;
  let robotTypeService: RobotTypeService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RobotTypeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [RobotTypeService, { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },],
    });

    fixture = TestBed.createComponent(RobotTypeComponent);
    component = fixture.componentInstance;
    robotTypeService = TestBed.inject(RobotTypeService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create a robotType', fakeAsync(() => {
    const robotType: RobotType = {
      id: "0012",
      robotModel: "Renault",
      brand: "Clio",
      tasks: "Pickup & Delivery"
    };
  
    spyOn(robotTypeService, 'createRobotType').and.returnValue(of(robotType));

    component.ngOnInit();
    tick();

    component.createRobotType('0011', 'Renault', "Clio", "Pickup & Delivery");
    tick();

    expect(component.robotTypes.length).toBe(1);
    expect(toastrService.success).toHaveBeenCalledWith('Tipo de Robô criado com sucesso!', 'Sucesso');
  }));
  

  it('should handle error when creating a robotType', fakeAsync(() => {

    const errorResponse = 'Error creating robotType';
  
    spyOn(robotTypeService, 'createRobotType').and.returnValue(throwError(errorResponse)); // Throw an error
  
    component.ngOnInit();
    tick();
  
    component.createRobotType('0011', 'Renault', "Clio", "Pickup & Delivery");
    tick();
  
    expect(component.robotTypes.length).toBe(0); // Ensure that the floors array is not modified on error
    expect(toastrService.error).toHaveBeenCalledWith(errorResponse, 'Erro');
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
