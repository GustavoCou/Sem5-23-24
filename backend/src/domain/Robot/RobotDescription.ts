import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

export interface RobotProps {
    value: string;
}

export class RobotDescription extends ValueObject<RobotProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: RobotProps) {
        super(props);
    }

    public static create(description: string): Result<RobotDescription> {
        const guardResult = Guard.againstNullOrUndefined(description, 'description');
        if (!guardResult.succeeded) {
            return Result.ok<RobotDescription>(new RobotDescription({ value: '' }))
        } else {

            if (description.length > 255) {
                Result.fail<RobotDescription>("The maximum length of the description is 255 characters");
            }
            return Result.ok<RobotDescription>(new RobotDescription({ value: description }))
        }
    }
}