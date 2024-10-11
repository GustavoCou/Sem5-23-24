import { TaskContact } from "./TaskContact";

interface TaskProps {
  type: string;
  robot: string;

  // Atributos específicos para securityTask
  building?: string;
  floors?: string[];
  emergencyContact?: TaskContact;

  // Atributos específicos para pickupDeliveryTask
  pickupRoom?: string;
  deliveryRoom?: string;
  pickupContact?: TaskContact;
  deliveryContact?: TaskContact;
  confirmationCode?: string;
  descriptionDelivery?: string;
}

export class TaskView {
  private props: TaskProps;


  private constructor(props: TaskProps) {
    this.props = props;
    this.validate()
  }


  private validate(): void {
    this.validateRequired("Robô ", this.props.robot);

    if (this.props.type === "securityTask") {
      this.validateRequired("Edificio Code", this.props.building);
      this.validateNonEmptyArray("floors", this.props.floors  || []);
      this.validateRequired(" Nome do Contato",this.props.emergencyContact?.name)
      this.validateRequired("Telefone do Contato",this.props.emergencyContact?.phone)
    } else if (this.props.type === "pickupDeliveryTask") {
      this.validateRequired("pickupRoom", this.props.pickupRoom);
      this.validateRequired("deliveryRoom", this.props.deliveryRoom);
      this.validateRequired("confirmationCode", this.props.confirmationCode);
    }
  }

  private validateNonEmptyArray(fieldName: string, value: any[]): void {
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(`${fieldName} deve selecionar ao menos um piso.`);
    }
  }
  private validateRequired(fieldName: string, value: any): void {
    if (value === undefined || value === null || value === "") {
      throw new Error(`${fieldName} não pode estar vazio.`);
    }
  }


  public static createSecurityTask(
    robot: string,
    building: string,
    floors: string[],
    emergencyContact: TaskContact
  ): TaskView {

    return new TaskView({
      type: "securityTask",
      robot,
      building,
      floors,
      emergencyContact,
    });
  }

  public static createPickupDeliveryTask(
    robot:string,
    pickupRoom: string,
    deliveryRoom: string,
    pickupContact: TaskContact,
    deliveryContact: TaskContact,
    confirmationCode: string,
    descriptionDelivery: string
  ): TaskView {

    return new TaskView({
      type: "pickupDeliveryTask",
      robot,
      pickupRoom,
      deliveryRoom,
      pickupContact,
      deliveryContact,
      confirmationCode,
      descriptionDelivery,
    });
  }

  public getType(): string {
    return this.props.type;
  }
  public getRobot(): string {
    return this.props.robot;
  }

  public getBuilding(): string | undefined {
    return this.props.building;
  }

  public getFloors(): string[] | undefined {
    return this.props.floors;
  }

  public getEmergencyContact(): TaskContact | undefined {
    return this.props.emergencyContact;
  }

  public getPickupRoom(): string | undefined {
    return this.props.pickupRoom;
  }

  public getDeliveryRoom(): string | undefined {
    return this.props.deliveryRoom;
  }

  public getPickupContact(): TaskContact | undefined {
    return this.props.pickupContact;
  }

  public getDeliveryContact(): TaskContact | undefined {
    return this.props.deliveryContact;
  }

  public getConfirmationCode(): string | undefined {
    return this.props.confirmationCode;
  }

  public getDescriptionDelivery(): string | undefined {
    return this.props.descriptionDelivery;
  }

}
