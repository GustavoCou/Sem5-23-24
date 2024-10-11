import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface BridgeIdProps {
    bridgeId: string;
}

export class BridgeId extends ValueObject<BridgeIdProps> {

    get bridgeId(): string {
        return this.props.bridgeId;
    }

    set bridgeId(value: string) {
        this.props.bridgeId = value;
    }

    public toString(): string {
        return this.props.bridgeId;
    }

    public constructor(props: BridgeIdProps) {
        super(props)
    }


    public static create(id: string): Result<BridgeId> {

        //validar se é null ou nao
        const guardResult = Guard.againstNullOrUndefined(id, 'BridgeId');
        const regexValidator = /^[A-Za-z0-9]{4}$/;

        if (!guardResult.succeeded || id === null) {
            return Result.fail<BridgeId>(guardResult.message);
        }

        if (!id.toString().match(regexValidator)) {
            return Result.fail<BridgeId>("Id not valid (4 carac)");

        }
        else {
            return Result.ok<BridgeId>(new BridgeId({ bridgeId: id }))
        }
    }
}