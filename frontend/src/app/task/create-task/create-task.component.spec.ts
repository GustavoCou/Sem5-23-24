import {ComponentFixture, TestBed, fakeAsync, tick, flush} from '@angular/core/testing';
import { Location } from "@angular/common";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from 'rxjs';
import { CreateTaskComponent } from './create-task.component';
import { BuildingService } from "../../services/building.service";
import { FloorService } from "../../services/floor.service";
import { TaskService } from "../../services/task.service";
import { TaskView } from "../../Domain/Task/TaskView";
import { TaskContact } from "../../Domain/Task/TaskContact";
import {HttpClientModule} from "@angular/common/http";
import {TaskRequestDTO} from "../../dto/TaskRequestDTO";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Floor} from "../../dto/floor";

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;
  let toastrServiceSpy: ToastrService;
  let locationSpy: Location;
  let buildingServiceSpy: BuildingService;
  let floorServiceSpy: FloorService;
  let taskServiceSpy: TaskService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTaskComponent],
      imports: [ReactiveFormsModule, ToastrModule.forRoot(), HttpClientModule, HttpClientTestingModule],
      providers: [
        Location,
        FormBuilder,
        BuildingService,
        FloorService,
        TaskService,
        ToastrService,
      ]
    });

    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    toastrServiceSpy = TestBed.inject(ToastrService);
    locationSpy = TestBed.inject(Location);
    buildingServiceSpy = TestBed.inject(BuildingService);
    floorServiceSpy = TestBed.inject(FloorService);
    taskServiceSpy = TestBed.inject(TaskService);




  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // ... (otros tests anteriores)

  it('should handle errors during security task creation', fakeAsync(() => {
    spyOn(toastrServiceSpy, 'error');
    spyOn(taskServiceSpy, 'createTask').and.returnValue(throwError('Test Error'));

    component.selectedTaskType = 'securityTask';
    component.onSubmit();
    tick();

    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Robô  não pode estar vazio.', 'Erro');
  }));

  it('should handle errors during pickup/delivery task creation', fakeAsync(() => {
    spyOn(toastrServiceSpy, 'error');
    spyOn(taskServiceSpy, 'createTask').and.returnValue(throwError('Test Error'));

    component.selectedTaskType = 'pickupDeliveryTask';
    component.onSubmit();
    tick();

    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Robô  não pode estar vazio.', 'Erro');
  }));


  it('should load buildings on init', () => {
    const mockBuildings = [
      { id: '1', name: 'Building 1', description: 'desc1', width: 5, depth: 5 },
      { id: '2', name: 'Building 2', description: 'desc2', width: 5, depth: 5 }
    ];
    spyOn(buildingServiceSpy, 'getBuildings').and.returnValue(of(mockBuildings));

    fixture.detectChanges();

    expect(component.buildings).toEqual(mockBuildings);
  });


  it('should load floors when building is selected', fakeAsync(() => {
    const mockFloors = [
      { id: '1', name: 'Floor 1', floorDescription: 'desc1', floorSize: { width: 5, depth: 5 }, building: '1' },
      { id: '2', name: 'Floor 2', floorDescription: 'desc2', floorSize: { width: 5, depth: 5 }, building: '1' }
    ];

    spyOn(floorServiceSpy, 'getFloorsByBuildingId').and.returnValue(of(mockFloors));

    // Set values with correct types
    component.formSecTask.controls['building'].setValue(1); // Assuming '1' is a valid building ID
    component.floors= [
      { id: '1', floorDescription: 'desc1', floorSize: { width: 5, depth: 5 }, building: '1' },
      { id: '2', floorDescription: 'desc2', floorSize: { width: 5, depth: 5 }, building: '1' }
    ]; // Assuming '1' and '2' are valid floor IDs

    fixture.detectChanges();


    console.log('component.floors:', component.floors); // Debugging statement

    expect(component.floors[0]).toEqual({
      id: '1',
      floorDescription: 'desc1',
      floorSize: { width: 5, depth: 5 },
      building: '1'
    });

  }));


  it('should toggle floor selection', () => {

    component.formSecTask.controls['floors'].setValue([1, 2]);

    component.toggleFloorSelection(1);

    expect(component.formSecTask.controls['floors'].value.length).toEqual(2);
    expect(component.formSecTask.controls['floors'].value[0]).toEqual(1);
  });



  it('should submit security task form', fakeAsync(() => {
    const mockTask: TaskView = TaskView.createSecurityTask('001','1',['2'],TaskContact.create('Name',958746547)) ;
    spyOn(toastrServiceSpy, 'success');

    spyOn(TaskView, 'createSecurityTask').and.returnValue(mockTask);
    spyOn(taskServiceSpy, 'createTask').and.returnValue(of({  id:"0001", requesterUser: "UserRequester", robot: "Test Robot", task: "123456", status: "Pending", date: new Date(), } as TaskRequestDTO ));

    // Set form values
    component.formSecTask.controls['robot'].setValue('Test Robot');
    component.formSecTask.controls['building'].setValue("1");
    component.formSecTask.controls['floors'].setValue(["1", "2"]);
    component.formSecTask.controls['emContactName'].setValue('Emergency Contact');
    component.formSecTask.controls['emContactPhone'].setValue('123456789');

    component.selectedTaskType = 'securityTask';
    component.onSubmit();
    tick();

    expect(TaskView.createSecurityTask).toHaveBeenCalledWith('Test Robot', "1", ["1", "2"], jasmine.any(TaskContact));
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(jasmine.any(Object), 'post');
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Tarefa criado com sucesso!', 'Sucesso');
  }));

   it('should submit pickup/delivery task form', fakeAsync(() => {
     const mockTask: TaskView =  TaskView.createPickupDeliveryTask('Test Robot','Pickup Room','Delivery Room',
        TaskContact.create('Pickup Contact',123456789), TaskContact.create('Delivery Contact',987654321),"ABC123","Description") ;

     spyOn(toastrServiceSpy, 'success');

     spyOn(TaskView, 'createPickupDeliveryTask').and.returnValue(mockTask);
     spyOn(taskServiceSpy, 'createTask').and.returnValue(of({  id:"0001", requesterUser: "UserRequester", robot: "Test Robot", task: "123456", status: "Pending", date: new Date(), } as TaskRequestDTO ));

     // Set form values
     component.formPickUpDeliveryTask.controls['robot'].setValue('Test Robot');
     component.formPickUpDeliveryTask.controls['pickupRoom'].setValue('Pickup Room');
     component.formPickUpDeliveryTask.controls['deliveryRoom'].setValue('Delivery Room');
     component.formPickUpDeliveryTask.controls['pickupContactName'].setValue('Pickup Contact');
     component.formPickUpDeliveryTask.controls['pickupContactPhone'].setValue('123456789');
     component.formPickUpDeliveryTask.controls['deliveryContactName'].setValue('Delivery Contact');
     component.formPickUpDeliveryTask.controls['deliveryContactPhone'].setValue('987654321');
     component.formPickUpDeliveryTask.controls['validationCode'].setValue('ABC123');
     component.formPickUpDeliveryTask.controls['descriptionDelivery'].setValue('Description');

     component.selectedTaskType = 'pickupDeliveryTask';
     component.onSubmit();
     tick();

     expect(TaskView.createPickupDeliveryTask).toHaveBeenCalledWith('Test Robot', 'Pickup Room', 'Delivery Room', jasmine.any(TaskContact), jasmine.any(TaskContact), 'ABC123', 'Description');
     expect(taskServiceSpy.createTask).toHaveBeenCalledWith(jasmine.any(Object), 'post');
     expect(toastrServiceSpy.success).toHaveBeenCalledWith('Tarefa criado com sucesso!', 'Sucesso');
   }));

   it('should handle errors during task creation', fakeAsync(() => {
     spyOn(toastrServiceSpy, 'error');
     spyOn(taskServiceSpy, 'createTask').and.returnValue(of());
     spyOn(TaskView, 'createSecurityTask').and.throwError('Test Error');

     component.selectedTaskType = 'securityTask';
     component.onSubmit();
     tick();

     expect(toastrServiceSpy.error).toHaveBeenCalledWith('Test Error', 'Erro');
   }));

});
