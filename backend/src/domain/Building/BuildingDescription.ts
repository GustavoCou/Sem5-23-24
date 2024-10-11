import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuildingDescriptionProps {
  value: string;
}

export class BuildingDescription extends ValueObject<BuildingDescriptionProps> {
  get value (): string {
    return this.props.value;
  }
  
  private constructor (props: BuildingDescriptionProps) {
    super(props);
  }

  public static create (description: string): Result<BuildingDescription> {
    if (description == null) {
      return Result.ok<BuildingDescription>(new BuildingDescription({ value :'' }))
    } else {

        if(description.length > 255){
          return  Result.fail<BuildingDescription>("The maximum length of the description is 255 characters");
        }
      return Result.ok<BuildingDescription>(new BuildingDescription({ value: description }))
    }
  }
}