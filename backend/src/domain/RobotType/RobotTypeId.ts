
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface RobotTypeIdProps {
  robotTypeId: UniqueEntityID;
}

export class RobotTypeId extends ValueObject<RobotTypeIdProps> {

  get id(): UniqueEntityID {
    return this.props.robotTypeId;
  }

  
  private constructor (id: RobotTypeIdProps) {
    super(id);
  }

  public static create (id: string): Result<RobotTypeId> {
    const guardResult = Guard.againstNullOrUndefined(id, 'id');
    

    if (!guardResult.succeeded) {
      return Result.fail<RobotTypeId>(guardResult.message);
    } else {
      const idPattern = /^[A-Za-z0-9\s]+$/; 

    if (id && !id.toString().match(idPattern)) {
    
      return Result.fail<RobotTypeId>(("The ID must be alphanumeric and can contain spaces."+id));
    
    }else if(id.length > 5){
     
      return Result.fail<RobotTypeId>("The maximum length of the id is 5 characters");

    }
      const uniqueID = new UniqueEntityID(id);
      return Result.ok<RobotTypeId>(new RobotTypeId({ robotTypeId: uniqueID }))
    }
  }
}
