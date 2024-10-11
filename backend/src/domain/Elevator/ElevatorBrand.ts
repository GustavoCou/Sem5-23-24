import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorBrandProps {
    elevatorBrand: string;
}

export class ElevatorBrand extends ValueObject<ElevatorBrandProps> {
    get elevatorBrand(): string {
        return this.props.elevatorBrand;
    }

    set elevatorBrand(value: string) {
        this.props.elevatorBrand = value;
    }


    private constructor(props: ElevatorBrandProps) {
        super(props);
    }
    public toString(): string {
        return this.elevatorBrand;
    }


    public static create(value: string | undefined): Result<ElevatorBrand> {
        if (value == undefined || value == null) {
            return Result.ok<ElevatorBrand>(new ElevatorBrand({ elevatorBrand: value }));
        }

        if (value.length > 50) {
            return Result.fail<ElevatorBrand>("The maximum length of the brand is 50 characters");
        }

        return Result.ok<ElevatorBrand>(new ElevatorBrand({ elevatorBrand: value }));
    }
}