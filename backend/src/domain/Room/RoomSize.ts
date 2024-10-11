import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoomSizeProps {
    width: number;
    depth: number
}

export class RoomSize extends ValueObject<RoomSizeProps> {

    get width(): number {
        return this.props.width;
    }

    get depth(): number {
        return this.props.depth;
    }

    private constructor(props: RoomSizeProps) {
        super(props);
    }

    public static create(width: number, depth: number): Result<RoomSize> {
        const guardResultWidth = Guard.againstNullOrUndefined(width, 'valueWidth');
        const guardResultDepth = Guard.againstNullOrUndefined(depth, 'valuedDepth');

        if (!guardResultWidth.succeeded) {
            return Result.fail<RoomSize>(guardResultWidth.message);
        }
        if (!guardResultDepth.succeeded) {
            return Result.fail<RoomSize>(guardResultDepth.message);
        }

        if (width * depth < 1) {
            return Result.fail<RoomSize>("Room needs a minimum area of 1");
        }

        return Result.ok<RoomSize>(new RoomSize({ width: width, depth: depth }))
    }

}