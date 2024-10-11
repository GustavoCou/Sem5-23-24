import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface FloorDescriptionProps {
    value : string;
}

export class FloorDescription extends ValueObject<FloorDescriptionProps> {
    get value(): string {
        return this.props.value;
    }

    set floorDescription(value: string) {
        this.props.value = value;
    }

    public toString(): string {
        return this.value;
    }

    private constructor(props: FloorDescriptionProps) {
        super(props);
    }

    public static create (value :  string | undefined): Result<FloorDescription> {
        if(value == undefined || value == null) {
            return Result.ok<FloorDescription>(new FloorDescription({value: value }));
        }

        if(value.length > 250) {
            return Result.fail<FloorDescription>("The maximum length of the description is 250 characters");
        }

        return Result.ok<FloorDescription>(new FloorDescription({value: value}));
    }
}