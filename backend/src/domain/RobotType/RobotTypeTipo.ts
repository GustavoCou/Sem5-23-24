import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

export interface RobotTypeTipoProps {
    value: string;
}

export class RobotTypeTipo extends ValueObject<RobotTypeTipoProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: RobotTypeTipoProps) {
        super(props);
    }

    public static create(tipo: string): Result<RobotTypeTipo> {
        const guardResult = Guard.againstNullOrUndefined(tipo, 'tipo');
        if (!guardResult.succeeded) {
            return Result.ok<RobotTypeTipo>(new RobotTypeTipo({ value: '' }))
        } else {

            if (tipo.length > 25) {
                Result.fail<RobotTypeTipo>("The maximum length of the type is 25 characters");
            }
            return Result.ok<RobotTypeTipo>(new RobotTypeTipo({ value: tipo }))
        }
    }
}