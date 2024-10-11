import {Component} from '@angular/core';
import {Location} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {BuildingService} from "../../services/building.service";
import {FloorService} from "../../services/floor.service";
import {Floor} from "../../dto/floor";
import Building from "../../dto/building";
import {TaskView} from "../../Domain/Task/TaskView";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskContact} from "../../Domain/Task/TaskContact";
import {TaskService} from "../../services/task.service";
import {TaskMap} from "../../mapper/TaskMap";

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {

  formSecTask: FormGroup;
  formPickUpDeliveryTask: FormGroup;

  floors: Floor[] = [];
  buildings: Building[] = [];


  selectedTaskType: string | null = null;


  constructor(private location: Location,
              private fb: FormBuilder,
              private toastrSrv: ToastrService,
              private buildingService: BuildingService,
              private floorService: FloorService,
              private taskService: TaskService) {

    this.formSecTask = this.fb.group({
      robot: ['', Validators.required],
      building: ['',],
      floors: [[]],
      emContactName: ['', Validators.required],
      emContactPhone: ['', Validators.required],
    });

    this.formPickUpDeliveryTask = this.fb.group({
      robot: ['', Validators.required],
      pickupRoom: ['',],
      deliveryRoom: ['',],
      pickupContactName: ['',],
      pickupContactPhone: ['',],
      deliveryContactName: ['',],
      deliveryContactPhone: ['',],
      validationCode: ['',],
      descriptionDelivery: ['',]
    });

  }


  ngOnInit() {
    this.loadBuildings();
  }

  onSubmit() {

    let task: TaskView;

    try {

    if (this.selectedTaskType == 'securityTask') {

      task = TaskView.createSecurityTask(this.formSecTask.value.robot,
        this.formSecTask.value.building,
        this.formSecTask.value.floors,
        TaskContact.create(this.formSecTask.value.emContactName, this.formSecTask.value.emContactPhone)
      )

    } else {

      task = TaskView.createPickupDeliveryTask(this.formPickUpDeliveryTask.value.robot,
        this.formPickUpDeliveryTask.value.pickupRoom,
        this.formPickUpDeliveryTask.value.deliveryRoom,
        TaskContact.create(this.formPickUpDeliveryTask.value.pickupContactName, this.formPickUpDeliveryTask.value.pickupContactPhone),
        TaskContact.create(this.formPickUpDeliveryTask.value.deliveryContactName, this.formPickUpDeliveryTask.value.deliveryContactPhone),
        this.formPickUpDeliveryTask.value.validationCode,
        this.formPickUpDeliveryTask.value.descriptionDelivery
      )

    }
    if(task == null){
      this.toastrSrv.error('Failed to create task. Verifique novamentente os dados\n', 'Error');
    }else{
      this.taskService.createTask( TaskMap.toDTO(task), 'post')
        .subscribe(
          floor => {
            this.toastrSrv.success('Tarefa criado com sucesso!', 'Sucesso');
          },
          error => {
            console.log(error)

            this.toastrSrv.error(error, 'Erro');
          });
    }
  } catch (e) {

    this.toastrSrv.error((e as Error).message, 'Erro');
  }

    }







  loadBuildings() {
    this.formSecTask.value.floors = [];

    this.buildingService.getBuildings()
      .subscribe(buildings => {
          this.buildings = buildings;
        },
        error => {
          // Trate os erros adequadamente
          console.error('Erro ao carregar edifícios', error);
        });

  }


  loadFloors() {
    this.formSecTask.value.floors = [];

    this.floorService.getFloorsByBuildingId(this.formSecTask.value.building).subscribe(
      floors => {
        this.floors = floors;
      },
      error => {
        console.error('Erro ao carregar pisos', error);

      }
    );
  }


  toggleFloorSelection(floorId: any) {
    if (this.formSecTask.value.floors.includes(floorId)) {

      this.formSecTask.value.floors = this.formSecTask.value.floors.filter((floor: any) => floor !== floorId);
    } else {

      this.formSecTask.value.floors.push(floorId);
    }
  }

  goBack() {
    this.location.replaceState(this.location.path());
    window.location.reload();
  }
}


/*
  securityTaskModel: any = {
    robot: '',
    type: 'securityTask',
    building: '',
    floors: [],
    emergencyContact: {
      name: '',
      phone: null
    }
  };*/
/*
  pickupDeliveryTaskModel: any = {
    robot: '',
    type: 'pickupDeliveryTask',
    pickupRoom: '',
    deliveryRoom: '',
    pickupContact: {
      name: '',
      phone: null
    },
    deliveryContact: {
      name: '',
      phone: null
    },
    confirmationCode: '',
    descriptionDelivery: ''
  };

*/
