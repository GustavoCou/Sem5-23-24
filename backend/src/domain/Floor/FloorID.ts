import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";


interface FloorIdProps {
    floorId: UniqueEntityID;
}

export class FloorID extends ValueObject<FloorIdProps> {
    get id(): UniqueEntityID {
        return this.props.floorId;
    }

    public constructor(id: FloorIdProps) {
        super(id)
    }
    public toString(): string {
        return this.id.toString();
    }

    public static create(id: string): Result<FloorID> {


        const guardResult = Guard.againstNullOrUndefined(id, 'FloorId');

        if (!guardResult.succeeded || id === null) {
            return Result.fail<FloorID>(guardResult.message);
        } else {
            const idPattern = /^[A-Za-z0-9\s-]+$/;

            if (id && !id.toString().match(idPattern)) {
                return Result.fail<FloorID>("The ID must be alphanumeric.");
            } else if (id.length > 10) {
                return Result.fail<FloorID>("The maximum length of the id is 10 characters");
            }

            const uniqueID = new UniqueEntityID(id);

            return Result.ok<FloorID>(new FloorID({ floorId: uniqueID }))
        }
    }
}
