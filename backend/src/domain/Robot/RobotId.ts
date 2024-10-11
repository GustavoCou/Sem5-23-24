import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface RobotIdProps {
    RobotId: UniqueEntityID;
}

export class RobotId extends ValueObject<RobotIdProps> {

    get id(): UniqueEntityID {
        return this.props.RobotId;
    }


    private constructor(id: RobotIdProps) {
        super(id);
    }

    public static create(id: string): Result<RobotId> {
        const guardResult = Guard.againstNullOrUndefined(id, 'id');


        if (!guardResult.succeeded) {
            return Result.fail<RobotId>(guardResult.message);
        } else {
            const idPattern = /^[A-Za-z0-9]+$/;

            if (id && !id.toString().match(idPattern)) {

                return Result.fail<RobotId>("The Robot ID must be alphanumeric and can't contain spaces.");

            } else if (id.length > 30) {

                return Result.fail<RobotId>("The maximum length of the id is 30 characters");

            }
            const uniqueID = new UniqueEntityID(id);
            return Result.ok<RobotId>(new RobotId({ RobotId: uniqueID }))
        }
    }
}
