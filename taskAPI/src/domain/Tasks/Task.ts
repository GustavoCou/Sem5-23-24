import {AggregateRoot} from '../../../../backend/src/core/domain/AggregateRoot';
import {UniqueEntityID} from '../../../../backend/src/core/domain/UniqueEntityID';
import {Result} from '../../../../backend/src/core/logic/Result';
import {Guard} from '../../../../backend/src/core/logic/Guard';
import {TaskId} from './TaskId';
import {TaskDescription} from './TaskDescription';

import {TaskType} from './TaskType';
import {TaskContact} from './TaskContact';
import {ITaskDTO} from "../../dto/ITaskDTO";

export interface TaskProps {

  type: TaskType;

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
  descriptionDelivery?: TaskDescription;
}

export class Task extends AggregateRoot<TaskProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get type(): TaskType{
    return this.props.type;
  }

  get building(): string  {
    return this.props.building;
  }

  get floors(): string[]  {
    return this.props.floors;
  }

  get emergencyContact(): TaskContact{
    return this.props.emergencyContact;
  }

  get pickupRoom(): string | undefined {
    return this.props.pickupRoom;
  }

  get deliveryRoom(): string | undefined {
    return this.props.deliveryRoom;
  }

  get pickupContact(): TaskContact | undefined {
    return this.props.pickupContact;
  }

  get deliveryContact(): TaskContact | undefined {
    return this.props.deliveryContact;
  }

  get confirmationCode(): string | undefined {
    return this.props.confirmationCode;
  }

  get descriptionDelivery(): TaskDescription | undefined {
    return this.props.descriptionDelivery;
  }

  private constructor(props: TaskProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ITaskDTO, id?: UniqueEntityID): Result<Task> {
    const guardedProps = [{argument: props.type, argumentName: 'type'}];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);


    if (!guardResult.succeeded) {
      return Result.fail<Task>(guardResult.message);
    }

    // Validar e construir atributos específicos segundo o tipo de tarefa
    switch (props.type) {

      case TaskType.SECURITY_TASK:

        return this.create_securityTask(props, id);

      case TaskType.PICK_UP_DELIVERY_TASK:

        return this.create_pickupDeliveryTask(props, id)

      default:

        return Result.fail<Task>('Tipo de tarefa desconhecido');
    }


  }

  private static create_securityTask(props: ITaskDTO, id?: UniqueEntityID) {

    const guardedProps = [
      { argument: props.type, argumentName: 'type' },
      { argument: props.building, argumentName: 'building' },
      { argument: props.floors, argumentName: 'floors'},
      { argument: props.emergencyContact, argumentName: 'emergencyContact'}
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Task>('Building, floors, and emergencyContact are required for securityTask.');
    }

    const emContact = TaskContact.create(props.emergencyContact.name, props.emergencyContact.phone);

    if (emContact.isFailure) {
      return Result.fail<Task>(emContact.error);
    }

    const task = new Task(
      {
        type: TaskType.SECURITY_TASK,
        building: props.building,
        floors: props.floors,
        emergencyContact: emContact.getValue()
      },id
    );
    return Result.ok<Task>(task);

  }

  private static create_pickupDeliveryTask(props: ITaskDTO, id?: UniqueEntityID) {


    const guardedProps = [
      { argument: props.pickupRoom, argumentName: 'pickupRoom' },
      { argument: props.deliveryRoom, argumentName: 'deliveryRoom' },
      { argument: props.pickupContact, argumentName: 'pickupContact'},
      { argument: props.deliveryContact, argumentName: 'deliveryContact'},
      { argument: props.confirmationCode, argumentName: 'confirmationCode'},
      { argument: props.descriptionDelivery, argumentName: 'descriptionDelivery'}
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Task>('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    }


    const description = TaskDescription.create(props.descriptionDelivery);
    const emContactPickup = TaskContact.create(props.pickupContact.name, props.pickupContact.phone);
    const emContactDelivery = TaskContact.create(props.deliveryContact.name, props.deliveryContact.phone);

    if (emContactPickup.isFailure)
      return Result.fail<Task>(emContactPickup.error);
    if (emContactDelivery.isFailure)
      return Result.fail<Task>(emContactDelivery.error);
    if (description.isFailure)
      return Result.fail<Task>(description.error)


    const task = new Task(
      {

        type: TaskType.PICK_UP_DELIVERY_TASK,
        pickupRoom: props.pickupRoom,
        deliveryRoom: props.deliveryRoom,
        pickupContact: emContactPickup.getValue(),
        deliveryContact: emContactDelivery.getValue(),
        confirmationCode: props.confirmationCode,
        descriptionDelivery: description.getValue(),
      },
      id
    );

    return Result.ok<Task>(task);
  }
}
