
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuildingSizeProps {
    width: number;
    depth: number
  }
  
  export class BuildingSize extends ValueObject<BuildingSizeProps> {
    
    get valueWidth (): number {
      return this.props.width;
    } 

    get valuedDepth (): number {
        return this.props.depth ;
      }
    
    private constructor (props : BuildingSizeProps) {
      super(props);
    }
  
    public static create (valueWidth: number , valuedDepth: number): Result<BuildingSize> {
      
      const guardResult = Guard.againstNullOrUndefined(valueWidth, 'valueWidth');
      const guardResult2 = Guard.againstNullOrUndefined(valuedDepth, 'valuedDepth');

      if (!guardResult.succeeded) {

        return Result.fail<BuildingSize>(guardResult.message);

      }else  if (!guardResult2.succeeded) {

        return Result.fail<BuildingSize>(guardResult2.message);
      } 

      if (valueWidth > 10 || valuedDepth > 10){
        return Result.fail<BuildingSize>("The maximum number of dimensions is 10");
      }

      if (valueWidth < 0 || valuedDepth < 0){
        return Result.fail<BuildingSize>("The  number of dimensions cannot be negative");
      }
        
      return Result.ok<BuildingSize>(new BuildingSize({ width: valueWidth , depth: valuedDepth }))
    }
  }