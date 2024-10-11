import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface ElevatorIdProps {
  elevatorId: string;
}

export class ElevatorId extends ValueObject<ElevatorIdProps> {

  get elevatorId(): string {
    return this.props.elevatorId;
  }

  set elevatorId(value: string) {
    this.props.elevatorId = value;
  }

  public toString(): string {
    return this.props.elevatorId;
  }

  public constructor(props: ElevatorIdProps) {
    super(props)
  }


  public static create(id: string): Result<ElevatorId> {

    //validar se é null ou nao
    const guardResult = Guard.againstNullOrUndefined(id, 'ElevatorId');

    const regexValidator = /^[A-Za-z0-9]{4}$/;

    if (!guardResult.succeeded || id === null) {
      return Result.fail<ElevatorId>(guardResult.message);
    }

    if (!id.toString().match(regexValidator)) {
      return Result.fail<ElevatorId>("Id not valid (4 carac)");

    }
    return Result.ok<ElevatorId>(new ElevatorId({ elevatorId: id }));
  }
}

