import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface FloorSizeProps {
    width : number;
    depth : number;
}

export class FloorSize extends ValueObject<FloorSizeProps> {
    get width() :  number {
        return this.props.width;
    }

    get depth() : number {
        return this.props.depth;
    }
 
    private constructor(props: FloorSizeProps) {
        super(props);
    }

    public static create(width: number, depth: number): Result<FloorSize> {
        const guardResult1 = Guard.greaterThanOrEqual(width, 0, 'width');
        const guardResult2 = Guard.greaterThanOrEqual(depth, 0, 'depth');

        if(!guardResult1.succeeded || !guardResult2.succeeded) {
            return Result.fail<FloorSize>(guardResult1.message || guardResult2.message);
        }

        if (width > 10 || depth > 10){
            return Result.fail<FloorSize>("The maximum number of dimensions is 10");
        }
        
        return Result.ok<FloorSize>(new FloorSize({width, depth}));
    }
}