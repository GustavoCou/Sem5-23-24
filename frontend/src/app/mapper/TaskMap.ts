import { TaskDTO } from "../dto/TaskDTO";
import { TaskView } from "../Domain/Task/TaskView";


export class TaskMap {

  public static toDTO(task: TaskView): TaskDTO {

    let dto: TaskDTO;


    if (task.getType() == "securityTask") {



      dto = {
        userId: "",
        robot: task.getRobot(),
        type: "securityTask",
        building: task.getBuilding(),
        floors: task.getFloors(),
        emergencyContact: {
          name: task.getEmergencyContact()?.name,
          phone: task.getEmergencyContact()?.phone,
        },
      }

    } else {


      dto = {
        userId: "",
        robot: task.getRobot(),
        type: "pickupDeliveryTask",
        pickupRoom: task.getPickupRoom(),
        deliveryRoom: task.getDeliveryRoom(),
        pickupContact: {
          name: task.getPickupContact()?.name,
          phone: task.getPickupContact()?.phone,
        },
        deliveryContact: {
          name: task.getDeliveryContact()?.name,
          phone: task.getDeliveryContact()?.phone
        },
        confirmationCode: task.getConfirmationCode(),
        descriptionDelivery: task.getDescriptionDelivery(),

      }
    }
    return dto;
  }
}
