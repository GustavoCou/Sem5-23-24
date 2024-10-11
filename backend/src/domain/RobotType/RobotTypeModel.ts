import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RobotTypeModelProps {
  value: string;
}

export class RobotTypeModel extends ValueObject<RobotTypeModelProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RobotTypeModelProps) {
    super(props);
  }

  public static create(robotModel: string): Result<RobotTypeModel> {
    const guardResult = Guard.againstNullOrUndefined(robotModel, 'robotModel');
    if (!guardResult.succeeded) {
      return Result.ok<RobotTypeModel>(new RobotTypeModel({ value: '' }))
    } else {

      if (robotModel.length > 64) {
        Result.fail<RobotTypeModel>("The maximum length of the model robotModel is 64 characters");
      }
      // Check for special characters
      const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (specialChars.test(robotModel)) {
        return Result.fail<RobotTypeModel>("The robotBrand should not contain special characters");
      }
      return Result.ok<RobotTypeModel>(new RobotTypeModel({ value: robotModel }))
    }
  }
}