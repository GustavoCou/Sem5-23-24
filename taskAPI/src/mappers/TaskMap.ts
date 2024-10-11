import {Mapper} from "../core/infra/Mapper";
import {Task} from "../domain/Tasks/Task";
import {ITaskDTO} from "../dto/ITaskDTO";
import {TaskType} from "../domain/Tasks/TaskType";
import {TaskContact} from "../domain/Tasks/TaskContact";
import {TaskDescription} from "../domain/Tasks/TaskDescription";

import {TaskId} from "../domain/Tasks/TaskId";
import {Result} from "../core/logic/Result";



export class TaskMap extends Mapper<Task> {


  public static toDTO(task: Task): ITaskDTO {

    let dto: ITaskDTO;


    if (task.type == TaskType.SECURITY_TASK) {



      dto = {
        id:task.id.toString(),
        type: TaskType.SECURITY_TASK,
        building: task.building,
        floors: task.floors,
        emergencyContact: {
          name: task.emergencyContact.name,
          phone: task.emergencyContact.phone
        },
      }

    } else if (task.type == TaskType.PICK_UP_DELIVERY_TASK) {


      dto = {
        id:task.id.toString(),
        type: TaskType.PICK_UP_DELIVERY_TASK,
        pickupRoom: task.pickupRoom,
        deliveryRoom: task.deliveryRoom,
        pickupContact: {
          name: task.props.pickupContact.name,
          phone: task.props.pickupContact.phone,
        },
        deliveryContact: {
          name: task.props.deliveryContact.name,
          phone: task.props.deliveryContact.phone
        },
        confirmationCode: task.confirmationCode,
        descriptionDelivery: task.props.descriptionDelivery.value,

      }
    }

    return dto;
  }
  public static async toDomain(raw: any): Promise<Task> {

    let taskProps = {}
    const taskId = TaskId.create(raw.id).getValue();

    if (raw.type == TaskType.SECURITY_TASK) {

      taskProps = {
        type: TaskType.SECURITY_TASK,
        building: raw.building,
        floors: raw.floors,
        emergencyContact: {
          name: raw.emergencyContact.name,
          phone: raw.emergencyContact.phone
        },
      }

    } else if (raw.type == TaskType.PICK_UP_DELIVERY_TASK) {


      const description = TaskDescription.create(raw.descriptionDelivery);
      const contactPickup = TaskContact.create(raw.pickupContact.name, raw.pickupContact.phone);
      const contactDelivery = TaskContact.create(raw.deliveryContact.name, raw.deliveryContact.phone);


      taskProps = {

        type: TaskType.PICK_UP_DELIVERY_TASK,
        pickupRoom: raw.pickupRoom,
        deliveryRoom: raw.deliveryRoom,
        pickupContact: contactPickup.getValue(),
        deliveryContact: contactDelivery.getValue(),
        confirmationCode: raw.confirmationCode,
        descriptionDelivery: description.getValue()

      }

    } else {

      console.log('the Type of the Task Type is undefined');
      return null;
    }

    const taskOrError = Task.create(taskProps as ITaskDTO, taskId.id)

    taskOrError.isFailure ? console.log(taskOrError.error) : '';

    return taskOrError.isSuccess ? taskOrError.getValue() : null;
  }

  public static toPersistence(task: Task): any {

    let toPersist:{};


    if (task.type == TaskType.SECURITY_TASK) {

      toPersist = {
        domainId: task.id.toString(),
        type: task.type,
        building: task.building,
        floors: task.floors,
        emergencyContact: {
          name: task.emergencyContact.name,
          phone: task.emergencyContact.phone
        }
      }

    } else {

      toPersist = {
        domainId: task.id.toString(),
        type: task.type,
        pickupRoom: task.pickupRoom,
        deliveryRoom: task.deliveryRoom,
        pickupContact: {name: task.pickupContact.name, phone: task.pickupContact.phone},
        deliveryContact: {name: task.deliveryContact.name, phone: task.deliveryContact.phone},
        confirmationCode: task.confirmationCode,
        descriptionDelivery: task.descriptionDelivery.value


      }
    }
    return toPersist;
  }
}
