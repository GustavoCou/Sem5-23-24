import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoomDescriptionProps {
    value: string;
}

export class RoomDescription extends ValueObject<RoomDescriptionProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: RoomDescriptionProps) {
        super(props);
    }

    public static create(description: string): Result<RoomDescription> {
        const guardResult = Guard.againstNullOrUndefined(description, 'description');

        if (!guardResult.succeeded) {
            return Result.fail<RoomDescription>("Description null or undefined")
        }
        else {
            if (description.length > 250) {
                return Result.fail<RoomDescription>("The maximum length of the description is 250 characters");
            }

            return Result.ok<RoomDescription>(new RoomDescription({ value: description }))
        }
    }

}