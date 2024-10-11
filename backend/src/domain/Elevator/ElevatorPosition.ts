import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface ElevatorPositionProps {
    posX: number;
    posY: number;
}

export class ElevatorPosition extends ValueObject<ElevatorPositionProps> {

    get posX(): number {
        return this.props.posX;
    }

    get posY(): number {
        return this.props.posY;
    }

    set posX(value: number) {
        this.props.posX = value;
    }

    set posY(value: number) {
        this.props.posY = value;
    }

    private constructor(props: ElevatorPositionProps) {
        super(props);
    }


    public static create(props: ElevatorPositionProps): Result<ElevatorPosition> {

        const elevator = [
            { argument: props.posX, argumentName: "posX" },
            { argument: props.posY, argumentName: "posY" }
        ];

        //verifica se o valor nos argumentos é null 
        const checkArguments = Guard.againstNullOrUndefinedBulk(elevator);

        if (!checkArguments.succeeded) {
            return Result.fail<ElevatorPosition>(checkArguments.message);
        } else {
            const elevator = new ElevatorPosition(
                {
                    ...props,
                }
            );

            return Result.ok<ElevatorPosition>(elevator);
        }

    }
}


