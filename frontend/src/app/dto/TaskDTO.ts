

export interface TaskDTO {
  userId: string;

  type: string;
  robot?: string;

  //  securityTask
  building?: string;
  floors?: string[];
  emergencyContact?: {
    name?: string,
    phone?: number
  };
  //  pickupDeliveryTask
  pickupRoom?: string;
  deliveryRoom?: string;
  pickupContact?: {
    name?: string,
    phone?: number
  };
  deliveryContact?: {
    name?: string,
    phone?: number
  };
  confirmationCode?: string;
  descriptionDelivery?: string;
}
