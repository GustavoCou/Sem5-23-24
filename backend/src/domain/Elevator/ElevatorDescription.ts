import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorDescriptionProps {
    elevatorDescription: string;
}

export class ElevatorDescription extends ValueObject<ElevatorDescriptionProps> {
    get elevatorDescription(): string {
        return this.props.elevatorDescription;
    }

    set elevatorDescription(value: string) {
        this.props.elevatorDescription = value;
    }


    private constructor(props: ElevatorDescriptionProps) {
        super(props);
    }
    public toString(): string {
        return this.elevatorDescription;
    }



    public static create(value: string | undefined): Result<ElevatorDescription> {
        if (value == undefined || value == null) {
            return Result.ok<ElevatorDescription>(new ElevatorDescription({ elevatorDescription: value }));
        }

        if (value.length > 250) {
            return Result.fail<ElevatorDescription>("The maximum length of the description is 250 characters");
        }

        return Result.ok<ElevatorDescription>(new ElevatorDescription({ elevatorDescription: value }));
    }
}