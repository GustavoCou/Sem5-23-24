
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface BuildingIdProps {
  buildingId: UniqueEntityID;
}

export class BuildingId extends ValueObject<BuildingIdProps> {

  get id(): UniqueEntityID {
    return this.props.buildingId;
  }


  private constructor(id: BuildingIdProps) {
    super(id);
  }

  public toString(): string {
    return this.props.buildingId.toString();
  }

  public static create(id: string): Result<BuildingId> {
    const guardResult = Guard.againstNullOrUndefined(id, 'id');


    if (!guardResult.succeeded) {
      return Result.fail<BuildingId>(guardResult.message);
    } else {
      const idPattern = /^[A-Za-z0-9\s]+$/;

      if (id && !id.toString().match(idPattern)) {

        return Result.fail<BuildingId>("The ID must be alphanumeric and can contain spaces.");

      } else if (id.length > 5) {

        return Result.fail<BuildingId>("The maximum length of the id is 5 characters");

      }
      const uniqueID = new UniqueEntityID(id);
      return Result.ok<BuildingId>(new BuildingId({ buildingId: uniqueID }))
    }
  }
}
