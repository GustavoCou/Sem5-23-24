import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorModelProps {
    elevatorModel: string;
}

export class ElevatorModel extends ValueObject<ElevatorModelProps> {
    get elevatorModel(): string {
        return this.props.elevatorModel;
    }

    set elevatorModel(value: string) {
        this.props.elevatorModel = value;
    }


    private constructor(props: ElevatorModelProps) {
        super(props);
    }

    public toString(): string {
        return this.elevatorModel;
    }


    public static create(value: string | undefined): Result<ElevatorModel> {
        if (value === undefined || value === null) {
            return Result.ok<ElevatorModel>(new ElevatorModel({ elevatorModel: value }));
        }

        if (value.length > 50) {
            return Result.fail<ElevatorModel>("The maximum length of the model is 50 characters");
        }

        return Result.ok<ElevatorModel>(new ElevatorModel({ elevatorModel: value }));
    }
}