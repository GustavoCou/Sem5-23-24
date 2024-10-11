import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RobotTypeBrandProps {
    value: string;
}

export class RobotTypeBrand extends ValueObject<RobotTypeBrandProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: RobotTypeBrandProps) {
        super(props);
    }

    public static create(robotBrand: string): Result<RobotTypeBrand> {
        const guardResult = Guard.againstNullOrUndefined(robotBrand, 'robotBrand');
        if (!guardResult.succeeded) {
            return Result.fail<RobotTypeBrand>("robotBrand is null or undefined");
        } else {
            if (robotBrand.length > 32) {
                return Result.fail<RobotTypeBrand>("The maximum length of the robotBrand is 32 characters");
            }

            // Check for special characters
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (specialChars.test(robotBrand)) {
                return Result.fail<RobotTypeBrand>("The robotBrand should not contain special characters");
            }

            return Result.ok<RobotTypeBrand>(new RobotTypeBrand({ value: robotBrand }));
        }
    }
}
