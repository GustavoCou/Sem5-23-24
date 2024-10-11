import {TaskType} from "../domain/Tasks/TaskType";

export interface ITaskPersistence {
  domainId: string,

  type: TaskType,

  //security
  building: string,
  floors: [string],
  emergencyContact: {name: string, phoneNumber: number},

  //pickUpDelivery
  pickupRoom: string,
  deliveryRoom: string,
  pickupContact: {name: string, phoneNumber: number},
  deliveryContact: {name: string, phoneNumber: number},
  confirmationCode: string,
  descriptionDelivery: string,
}
