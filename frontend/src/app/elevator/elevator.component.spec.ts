import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ElevatorComponent } from './elevator.component';
import { Router } from '@angular/router';

describe('ElevatorComponent', () => {
  let component: ElevatorComponent;
  let fixture: ComponentFixture<ElevatorComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElevatorComponent],
      imports: [RouterTestingModule.withRoutes([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ElevatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all show flags set to false initially', () => {
    expect(component.showCreateElevator).toBeFalse();
    expect(component.showListFloorBuildingElevator).toBeFalse();
    expect(component.showListElevator).toBeFalse();
    expect(component.showEditElevator).toBeFalse();
  });

  it('should reset all show properties when resetShow is called', () => {
    component.showCreateElevator = true;
    component.showListFloorBuildingElevator = true;
    component.showListElevator = true;
    component.showEditElevator = true;

    component.resetShow();

    expect(component.showCreateElevator).toBeFalse();
    expect(component.showListFloorBuildingElevator).toBeFalse();
    expect(component.showListElevator).toBeFalse();
    expect(component.showEditElevator).toBeFalse();
  });

  it('should navigate to "/home" when backToMenu is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.backToMenu();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

});
