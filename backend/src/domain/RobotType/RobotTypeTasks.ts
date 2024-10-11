import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RobotTypeTasksProps {
    value: string;
}

export class RobotTypeTasks extends ValueObject<RobotTypeTasksProps> {
    get tasks(): string {
        return this.props.value;
    }

    private constructor(props: RobotTypeTasksProps) {
        super(props);
    }

    public static create(tasks: string): Result<RobotTypeTasks> {
        const guardResult = Guard.againstNullOrUndefined(tasks, 'tasks');
        if (!guardResult.succeeded) {
            return Result.fail<RobotTypeTasks>("Tasks is null or undefined");
        } else {
            const allowedValues = ["Vigilância", "Pickup & Delivery"];

            if (!allowedValues.includes(tasks)) {
                return Result.fail<RobotTypeTasks>("Invalid value for tasks. Allowed values are 'Vigilância' and 'Pickup & Delivery'");
            }

            return Result.ok<RobotTypeTasks>(new RobotTypeTasks({ value: tasks }));
        }
    }
}
