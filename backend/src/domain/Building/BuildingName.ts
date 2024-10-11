import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuldingNameProps {
  value: string;
}

export class BuildingName extends ValueObject<BuldingNameProps> {
 
  get value (): string {
    return this.props.value;
  }
  
  private constructor (props: BuldingNameProps) {
    super(props);
  }

  public static create (name: string): Result<BuildingName> {
    
    if (name == null) {
        return Result.ok<BuildingName>(new BuildingName({ value :'' }))
      } else {
  
          if(name.length > 50){
            return Result.fail<BuildingName>("The maximum length of the Name is 50 characters");
          }
        return Result.ok<BuildingName>(new BuildingName({ value: name }))
      }
  }
}