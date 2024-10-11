import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoomTypeProps {
    value: string;
}

export class RoomType extends ValueObject<RoomTypeProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: RoomTypeProps) {
        super(props);
    }

    public static create(type: string): Result<RoomType> {
        const guardResult = Guard.againstNullOrUndefined(type, 'description');

        if (!guardResult.succeeded) {
            return Result.fail<RoomType>(guardResult.message);
        }

        if (["Gabinete", "Anfiteatro", "Laboratório", "Outro"].indexOf(type) < 0) {
            return Result.fail<RoomType>("Room type can only be 'Gabinete', 'Anfiteatro', 'Laboratório', 'Outro'");
        }

        return Result.ok<RoomType>(new RoomType({ value: type }));
    }

}