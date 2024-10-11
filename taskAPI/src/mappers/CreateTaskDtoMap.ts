import {ITaskDTO} from "../dto/ITaskDTO";
import {ICreateTaskDTO} from "../dto/CreateTaskDTO";
import {Mapper} from "../core/infra/Mapper";
import {TaskType} from "../domain/Tasks/TaskType";

export class CreateTaskDtoMap extends Mapper<any> {

  public static toTaskDTO(createTaskDto: ICreateTaskDTO): ITaskDTO {

    let taskDTO: ITaskDTO = {
      type: createTaskDto.type,
    };

    if (createTaskDto.type === TaskType.SECURITY_TASK) {
      // Tarea de seguridad
      taskDTO = {
        ...taskDTO,
        building: createTaskDto.building,
        floors: createTaskDto.floors,
        emergencyContact: createTaskDto.emergencyContact
          ? {
            name: createTaskDto.emergencyContact.name,
            phone: createTaskDto.emergencyContact.phone
          }
          : undefined,
      };
    } else if (createTaskDto.type === TaskType.PICK_UP_DELIVERY_TASK) {
      // Tarea de recogida/entrega
      taskDTO = {
        ...taskDTO,
        pickupRoom: createTaskDto.pickupRoom,
        deliveryRoom: createTaskDto.deliveryRoom,
        pickupContact: {
          name: createTaskDto.pickupContact.name,
          phone: createTaskDto.pickupContact.phone
        },
        deliveryContact: {
          name: createTaskDto.deliveryContact.name,
          phone: createTaskDto.deliveryContact.phone
        },
        confirmationCode: createTaskDto.confirmationCode,
        descriptionDelivery: createTaskDto.descriptionDelivery,
      };
    }

    return taskDTO;
  }
}
