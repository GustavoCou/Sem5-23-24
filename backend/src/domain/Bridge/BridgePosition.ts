import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface BridgePositionProps {
    posX: number;
    posY: number;
}

export class BridgePosition extends ValueObject<BridgePositionProps> {

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

    private constructor(props: BridgePositionProps) {
        super(props);
    }


    public static create(props: BridgePositionProps): Result<BridgePosition> {

        const bridge = [
            { argument: props.posX, argumentName: "posX" },
            { argument: props.posY, argumentName: "posY" }
        ];

        //verifica se o valor nos argumentos é null 
        const checkArguments = Guard.againstNullOrUndefinedBulk(bridge);

        if (!checkArguments.succeeded) {
            return Result.fail<BridgePosition>(checkArguments.message);
        } else {
            const bridge = new BridgePosition(
                {
                    ...props,
                }
            );

            return Result.ok<BridgePosition>(bridge);
        }

    }
}


