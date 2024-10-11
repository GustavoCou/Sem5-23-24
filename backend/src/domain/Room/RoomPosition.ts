import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoomPositionProps {
    posX: number;
    posY: number
}

export class RoomPosition extends ValueObject<RoomPositionProps> {

    get posX(): number {
        return this.props.posX;
    }

    get posY(): number {
        return this.props.posY;
    }

    private constructor(props: RoomPositionProps) {
        super(props);
    }

    public static create(posX: number, posY: number): Result<RoomPosition> {
        const guardResult_posX = Guard.againstNullOrUndefined(posX, 'valueWidth');
        const guardResult_posY = Guard.againstNullOrUndefined(posY, 'valuedDepth');

        if (!guardResult_posX.succeeded) {
            return Result.fail<RoomPosition>(guardResult_posX.message);
        }
        if (!guardResult_posY.succeeded) {
            return Result.fail<RoomPosition>(guardResult_posY.message);
        }

        if (posX < 0 || posY < 0) {
            return Result.fail<RoomPosition>("Position has to be positive on both axis.");
        }

        return Result.ok<RoomPosition>(new RoomPosition({ posX: posX, posY: posY }))
    }

}